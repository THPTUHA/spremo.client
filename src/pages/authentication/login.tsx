
import { Code } from '../../Constants';
import React, { useCallback, useState } from 'react';
import { FaUser, FaLock, FaFacebook, FaGooglePlus, FaUnlock, FaCheck } from 'react-icons/fa';
import Fetch from '../../services/Fetch';
import { Toast } from '../../services/Toast';
import { Helper } from '../../services/Helper';
import { MeFunctions } from '../../store/me/functions';
import { useNavigate } from 'react-router-dom';
import { SocketFunctions } from '../../store/socket/funtions';

const Login = () => {

    const navigate = useNavigate();
    const [data, setData] = useState({
        username: '',
        password: ''
    });

    const [onLoading, setOnLoading] = useState(false);

    const onChangeHandle = useCallback((e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }, [data])

    const onSubmitHandle = useCallback(async (e) => {
        e.preventDefault();

        if (!data.password || !data.username) {
            Toast.error("Name or password can not be empty!")
            return;
        }
        console.log("Data",data);
        setOnLoading(true);
        try {
            const res: any = await Fetch.post("/api/authentication/signin", {
                password: data.password,
                username: data.username,

            })

            setOnLoading(false);

            if (res && res.data) {
                if (res.data.code != Code.SUCCESS) {
                    Toast.error(res.data.message)
                    return;
                }
                else {
                    Fetch.setAccessToken(res.data.access_token);
                    Helper.setCookie("access_token", res.data.access_token, 100);
                    localStorage.setItem("access_token", res.data.access_token);
                    Helper.setCookie("user_id", res.data.id, 100)
                    Toast.success("Login successful!")
                    await MeFunctions.loadProfile();
                    await SocketFunctions.init();
                    navigate("../");
                    return;
                }
            }
        }
        catch {

        }
        setOnLoading(false);
        Toast.error("Some errors occurred!")
    }, [data])

    return (
        <div style={{backgroundImage:`url(https://i.pinimg.com/564x/20/9d/c8/209dc8034a1ca4032d499049205fa801.jpg)`,height: window.innerHeight}} 
            className="w-full -mt-10 text-black">
            <div className='flex flex-col items-center '>
                <div className='font-bold text-6xl text-gray-500 mt-20 mb-5'>Spremo</div>
                <div className='mb-2'>
                    <input  type="text" placeholder='Email or Username'  id='username' name="username" onChange={onChangeHandle} className="w-72 rounded h-11 pl-3 focus:outline-none"/>
                </div>
                <div className='mb-2'>
                    <input  type="password" placeholder='Password'  id='password' name="password" onChange={onChangeHandle} className="w-72 rounded h-11 pl-3 focus:outline-none"/>
                </div>
                <button onClick={onSubmitHandle} className="w-72 bg-blue-400 h-11 rounded font-medium mt-4">
                    Log in
                </button>
            </div>
        </div>
    )
}

export default Login;