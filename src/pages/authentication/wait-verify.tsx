import { RiMailSendLine } from 'react-icons/ri';

import { Link } from 'react-router-dom';
import React from 'react';

const WaitingRegister = () => {
    return (<>
        <div className="w-full flex h-full items-center">
            <div className="flex flex-col mt-20 mb-20 px-10 py-10 shadow-md mx-auto justify-center rounded-lg">
                <div className="flex justify-center">
                    <span className="text-5xl  text-gray-700"><RiMailSendLine /></span>
                </div>
                <h1 className=" text-center text-2xl font-semibold text-gray-700 mb-3">Confirm your email</h1>
                <p className="text-center text-gray-400 mb-2">Thanks for signing up! <br />Please check your email to verify your account!</p>
                <p className=" text-center text-2xl font-semibold text-gray-400 ">After email is sent, check in your spam also</p>

                <Link to="/">
                    <a className="mt-7 w-4/5 mx-auto flex bg-primary justify-center shadow-lg rounded-lg hover:bg-primary-dark transition-all text-white items-center py-2 font-semibold">
                        Back to Home
                    </a>
                </Link>
            </div>
        </div>
    </>)
}

export default WaitingRegister;