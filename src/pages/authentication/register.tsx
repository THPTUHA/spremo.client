import { Code } from '../../Constants';
import React, { useCallback, useState } from 'react';
import { FaUser, FaLock, FaFacebook, FaGooglePlus, FaUnlock, FaCheck, FaMailBulk } from 'react-icons/fa';
import { AiOutlineLoading3Quarters} from 'react-icons/ai'
import Fetch from '../../services/Fetch';
import { Toast } from '../../services/Toast';
import { useRouter } from 'next/dist/client/router';
import Meta from '../../components/ui/Meta';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [onLoading, setOnLoading] = useState(false);
    // const router = useRouter();
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

    const onSubmitHandler = useCallback(async () => {
        setOnLoading(true);
        const res: any = await Fetch.post('/api/auth/signup', {
            ...data
        })

        setOnLoading(false);

        if (res.data && res.data.code == Code.SUCCESS) {
            Toast.success(res.data.message);
            navigate('.../authentication/wait-verify');
        } else if (res.data && res.data.code) {
            Toast.error(res.data.message);
        } else {
            Toast.error(res.data.message);
        }
    }, [data])

    return (<>
            <Meta/>
        <div className="w-full flex h-full items-center">
            <div className="w-full xs:w-96 flex flex-col mt-20 mb-20 px-5 xs:px-10 py-10 shadow-md mx-auto justify-center rounded-lg">
                <h1 className=" text-center text-2xl font-semibold text-gray-700 mb-5">Register Account </h1>

                <form action="">
                    <div className="w-full relative mb-3 bg-gray-100 rounded-lg">
                        <label htmlFor="email" className="absolute top-3 text-lg left-3 text-primary"><span><FaMailBulk /></span></label>
                        <input onChange={onChangeHandle} id="email" name="email" className="rounded-lg bg-transparent outline-none border-2 border-transparent focus:border-primary  py-2 px-10 w-full transition-all" type="text" placeholder="Email" />
                    </div>
                    <div className="w-full relative mb-3 bg-gray-100 rounded-lg">
                        <label htmlFor="username" className="absolute top-3 text-lg left-3 text-primary"><span><FaUser /></span></label>
                        <input  onChange={onChangeHandle} id="username" name="username" className="rounded-lg bg-transparent outline-none border-2 border-transparent focus:border-primary  py-2 px-10 w-full transition-all" type="text" placeholder="UserName" />
                    </div>
                    <div className="w-full relative mb-4 bg-gray-100 rounded-lg">
                        <label htmlFor="password" className="absolute top-3 text-lg left-3 text-primary"><span><FaLock /></span></label>
                        <input onChange={onChangeHandle} id="password" name="password" className="rounded-lg bg-transparent outline-none border-2 border-transparent focus:border-primary  py-2 px-10 w-full transition-all" type="password" placeholder="Password" />
                    </div>
                    <div className="w-full relative mb-4 bg-gray-100 rounded-lg">
                        <label htmlFor="confirm_password" className="absolute top-3 text-lg left-3 text-primary"><span><FaUnlock /></span></label>
                        <input onChange={onChangeHandle} id="confirm_password" name="confirm_password" className="rounded-lg bg-transparent outline-none border-2 border-transparent focus:border-primary  py-2 px-10 w-full transition-all" type="password" placeholder="Confirm Password" />
                    </div>



                    <div className="w-full mt-5 mb-3">
                        <a 
                        onClick={onSubmitHandler}
                        className="w-full flex bg-primary justify-center shadow-lg rounded-lg hover:bg-primary-dark transition-all text-white items-center py-2 font-semibold cursor-pointer">
                            {onLoading && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>} <span>Register</span>
                        </a>
                    </div>

                    {/* <div className=" w-full flex justify-center items-center">
                        <div style={{ height: 1 }} className="bg-gray-400 flex-1 mr-2 opacity-50"></div>
                        <p className=" flex-shrink-0 text-sm text-gray-500 font-medium">Or sign up with</p>
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

export default Register;