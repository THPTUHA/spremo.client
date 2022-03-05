
import { Code } from '../../Constants';
import { useRouter } from 'next/dist/client/router';
import React, { useCallback, useState } from 'react';
import { FaUser, FaLock, FaFacebook, FaGooglePlus, FaUnlock, FaCheck } from 'react-icons/fa';
import Fetch from '../../services/Fetch';
import { Toast } from '../../services/Toast';
import Link from 'next/link';
import { AiOutlineLoading3Quarters} from 'react-icons/ai'
import { Helper } from '../../services/Helper';
import Meta from '../../components/ui/Meta';
import { MeFunctions } from '../../store/me/functions';
import { useNavigate } from 'react-router-dom';
const Login = () => {

    // const router = useRouter();
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

        setOnLoading(true);
        try {
            const res: any = await Fetch.post("/api/auth/signin", {
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
                    console.log(res.data);
                    Helper.setCookie("user_id", res.data.id, 100)
                    Toast.success("Login successful!")

                    await MeFunctions.loadProfile();
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

    return (<>
            <Meta/>
        <div className="w-full flex h-full items-center">
            <div className="w-full xs:w-96 flex flex-col mt-20 mb-20 px-5 xs:px-10 py-10 shadow-md mx-auto justify-center rounded-lg">
                <h1 className=" text-center text-2xl font-semibold text-gray-700 mb-5">Welcome to <span className="text-primary">WELE</span></h1>

                <form action="">
                    <div className="w-full relative mb-3 bg-gray-100 rounded-lg">
                        <label className="absolute top-3 text-lg left-3 text-primary" htmlFor="username"><span><FaUser /></span></label>
                        <input onChange={onChangeHandle} id="username" name="username" className="rounded-lg bg-transparent outline-none border-2 border-transparent focus:border-primary  py-2 px-10 w-full transition-all" type="text" placeholder="User Name or Email" />
                    </div>
                    <div className="w-full relative mb-4 bg-gray-100 rounded-lg">
                        <label className="absolute top-3 text-lg left-3 text-primary" htmlFor="password"><span><FaLock /></span></label>
                        <input onChange={onChangeHandle} id="password" name="password" className="rounded-lg bg-transparent outline-none border-2 border-transparent focus:border-primary  py-2 px-10 w-full transition-all" type="password" placeholder="Password" />
                    </div>

                    <div className="w-full flex flex-col xs:flex-row justify-between">
                        <div className="flex items-center">
                            <div className="relative mr-2 border-2 border-primary rounded-md px-0.5 py-0.5">
                                <input id="remember-me" className="absolute h-6 w-6 left-0 opacity-0 cursor-pointer top-0 nextOnChecked:text-primary" type="checkbox" name="" />
                                <span className=" text-sm text-transparent transition-all">
                                    <FaCheck />
                                </span>
                            </div>
                            <label htmlFor="remember-me">Remember me</label>
                        </div>
                        <Link href={'/authentication/forgot-password'}>
                            <a className="mt-3 xs:mt-0 text-sm text-gray-800 hover:text-primary transition-all" >Forgot password?</a>
                        </Link>
                    </div>

                    <div className="w-full mt-5 mb-3">
                        <button onClick={onSubmitHandle}
                            className=" outline-none focus:outline-none w-full flex bg-primary justify-center shadow-lg rounded-lg hover:bg-primary-dark transition-all text-white items-center py-2 font-semibold">
                                {onLoading && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>} <span>Login</span>
                            </button>
                    </div>
                    {/* 
                    <div className=" w-full flex justify-center items-center">
                        <div style={{ height: 1 }} className="bg-gray-400 flex-1 mr-2 opacity-50"></div>
                        <p className=" flex-shrink-0 text-sm text-gray-500 font-medium">Or log in with</p>
                        <div style={{ height: 1 }} className="h-1 bg-gray-400 flex-1 ml-2 opacity-50"></div>
                    </div>
                    <div className="flex justify-between mt-5">
                        <a href="#" className="flex items-center hover:bg-blue-600 transition-all justify-center bg-blue-500 w-1/2 py-2 shadow text-white rounded-lg"><span className="mr-1"><FaFacebook /></span><span>Facebook</span></a>
                        <a href="#" className="flex items-center hover:bg-red-500 transition-all justify-center bg-red-400 w-1/2 ml-2 py-2 shadow text-white rounded-lg"><span className="mr-1"><FaGooglePlus /></span><span>Google+</span></a>
                    </div> */}
                </form>
            </div>
        </div>

    </>)
}

export default Login;