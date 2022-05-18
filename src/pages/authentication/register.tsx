import { Code } from '../../Constants';
import React, { useCallback, useState } from 'react';
import Fetch from '../../services/Fetch';
import { Toast } from '../../services/Toast';
import { useNavigate } from 'react-router-dom';
import { MeFunctions } from '../../store/me/functions';


const RegisterDeveloper = ()=>{
    const [is_agree, setIsAgree] = useState(false);
    const [onLoading, setOnLoading] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({
        password: '',
        confirm_password: '',
        username: '',
        email: ''
    });

    const onChangeHandle = useCallback((e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }, [data])

    const onSubmitHandle = useCallback(async () => {
        console.log("IS_AGREE",is_agree);
        if(!is_agree){
            Toast.error("You must agree to the Terms");
            return;
        }
        setOnLoading(true);
        const res: any = await Fetch.post('/api/authentication/signup', {
            ...data,
            is_developer: true,
            is_agree: is_agree
        })

        setOnLoading(false);
        if (res.data && res.data.code == Code.SUCCESS) {
            // MeFunctions.init(res.data.user);
            Toast.success(res.data.message);
            navigate('../authentication/wait-verify');
        } else if (res.data && res.data.code) {
            Toast.error(res.data.message);
        } else {
            Toast.error(res.data.message);
        }
    }, [data,is_agree])


    return (<>
        <div className='flex flex-col items-center ml-5 '>
            <div className='font-bold text-6xl text-gray-500 mt-20 mb-5'>Developer Spremo</div>
            <div className='mb-2'>
                <input  type="email" placeholder='Email'  id='email' name="email" onChange={onChangeHandle} className="w-72 rounded h-11 pl-3 focus:outline-none"/>
            </div>
            <div className='mb-2'>
                <input  type="text" placeholder='UserName'  id='username' name="username" onChange={onChangeHandle} className="w-72 rounded h-11 pl-3 focus:outline-none"/>
            </div>
            <div className='mb-2'>
                <input  type="password" placeholder='Password'  id='password' name="password" onChange={onChangeHandle} className="w-72 rounded h-11 pl-3 focus:outline-none"/>
            </div>
            <div className='mb-2'>
                <input  type="password" placeholder='Confirm password'  id='confirm_password' name="confirm_password" onChange={onChangeHandle} className="w-72 rounded h-11 pl-3 focus:outline-none"/>
            </div>
            <div className='mb-2 flex items-center'>
                <input type="checkbox" checked={is_agree} onChange={()=>{setIsAgree(!is_agree)}}/>
                <div>I agree to the Spremo Terms and Conditions, Privacy Policy</div>
            </div>
            <button onClick={onSubmitHandle} className="w-72 bg-blue-400 h-11 rounded font-medium mt-4">
                Register
            </button>
        </div>
    </>)
}

const Register = () => {
    const [onLoading, setOnLoading] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({
        password: '',
        confirm_password: '',
        username: '',
        email: ''
    });

    const onChangeHandle = useCallback((e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }, [data])

    const onSubmitHandle = useCallback(async () => {
        setOnLoading(true);
        console.log(data)
        const res: any = await Fetch.post('/api/authentication/signup', {
            ...data
        })

        setOnLoading(false);
        if (res.data && res.data.code == Code.SUCCESS) {
            Toast.success(res.data.message);
            navigate('../authentication/wait-verify');
        } else if (res.data && res.data.code) {
            Toast.error(res.data.message);
        } else {
            Toast.error(res.data.message);
        }
    }, [data])

    return (<>
        <div style={{backgroundImage:`url(https://i.pinimg.com/564x/20/9d/c8/209dc8034a1ca4032d499049205fa801.jpg)`,height: window.innerHeight}} 
            className=" w-full -mt-10 text-black flex justify-center">
            <div className='flex flex-col items-center border-r-4 border-white pr-5'>
                <div className='font-bold text-6xl text-gray-500 mt-20 mb-5'>Spremo</div>
                <div className='mb-2'>
                    <input  type="email" placeholder='Email'  id='email' name="email" onChange={onChangeHandle} className="w-72 rounded h-11 pl-3 focus:outline-none"/>
                </div>
                <div className='mb-2'>
                    <input  type="text" placeholder='UserName'  id='username' name="username" onChange={onChangeHandle} className="w-72 rounded h-11 pl-3 focus:outline-none"/>
                </div>
                <div className='mb-2'>
                    <input  type="password" placeholder='Password'  id='password' name="password" onChange={onChangeHandle} className="w-72 rounded h-11 pl-3 focus:outline-none"/>
                </div>
                <div className='mb-2'>
                    <input  type="password" placeholder='Confirm password'  id='confirm_password' name="confirm_password" onChange={onChangeHandle} className="w-72 rounded h-11 pl-3 focus:outline-none"/>
                </div>
                <button onClick={onSubmitHandle} className="w-72 bg-blue-400 h-11 rounded font-medium mt-4">
                    Register
                </button>
            </div>
            <RegisterDeveloper/>
        </div>
    </>)
}

export default Register;