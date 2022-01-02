import { useCallback, useState } from 'react';
import { MdNotifications } from 'react-icons/md';

import { CSSTransition } from 'react-transition-group';

import OutsideClickDetection from '../../components/ui/OutsideClickDetection';
import CurrentUser from '../../services/CurrentUser';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { MeHook } from '../../store/me/hooks';
import { MeFunctions } from '../../store/me/functions';
import {Link} from "react-router-dom";
import { useRouter } from 'next/router';

const Navbar = () => {

    const router = useRouter();
    const [open_nav, setOpenNav] = useState(false);
    const [open_user_menu, setOpenUserMenu] = useState(false);

    const me = MeHook.useMe();
    const logout = useCallback(() => {
        setOpenUserMenu(false);
        MeFunctions.logout();
        router.push("/");
    }, [me])

    return (
        <>
            <nav className=" z-40 fixed left-0 top-0 w-full shadow">
                <div className="relative flex justify-between items-center px-5 2xl:px-16 bg-white">
                    <div className="flex items-center">
                        <Link to="/" >
                            <a className="flex items-center text-xl xs:mr-5 text-primary hover:text-primary">
                                <img src={`/static/logo.png`} className=" h-10" alt="" />
                            </a>
                        </Link>
                    </div>
                    <div className="items-center flex">
                        {CurrentUser.getUser() ? <div className="ml-3 py-1 flex items-center relative">
                            <span className="flex items-center justify-center px-2 py-1.5 text-lg bg-primary text-white rounded-lg"
                            ><MdNotifications /></span>
                            <OutsideClickDetection outsideFunc={() => setOpenUserMenu(false)}>
                                <div
                                    onClick={() => setOpenUserMenu(!open_user_menu)}
                                    className="ml-1 relative flex items-center cursor-pointer rounded-full hover:bg-primary-light py-1 px-1.5">

                                    {CurrentUser.getUser()?.avatar ? <></> : (<span
                                        className=" text-2xl rounded-full inline-block">
                                        <FaRegUserCircle />
                                    </span>)}
                                    <span className="font-medium ml-1 text-base">{CurrentUser.getUser()?.fullname}</span>
                                    <CSSTransition
                                        in={open_user_menu}
                                        classNames="user-menu"
                                        unmountOnExit
                                        timeout={300}
                                    >
                                        <div className="absolute top-full w-48 right-0 rounded px-3 py-2 bg-white shadow">
                                            <Link to="/" >
                                                <a target="_blank" className="px-1 py-1 mb-1 cursor-pointer flex items-center text-gray-800 hover:text-gray-600 transition-all">
                                                    <span className="mr-1"><FiLogOut /></span>
                                                    <span>Home</span>
                                                </a>
                                            </Link>
                                            <span onClick={logout} className="px-1 py-1 cursor-pointer flex items-center text-gray-800 hover:text-gray-600 transition-all">
                                                <span className="mr-1"><FiLogOut /></span>
                                                <span>Logout</span>
                                            </span>
                                        </div>
                                    </CSSTransition>
                                </div>

                            </OutsideClickDetection>
                        </div> : <div className="ml-3 py-2 flex items-center">
                            <Link to={'/authentication/register'}>
                                <a className="text-sm inline-block rounded-sm text-center bg-primary-light px-2 py-1.5  font-semibold text-primary-dark hover:text-white hover:bg-primary-dark transition-all">
                                    Sign up
                                </a>

                            </Link>
                            <Link to={'/authentication/login'}>
                                <a className="text-sm ml-3 inline-block rounded-sm text-center bg-primary px-2 py-1.5 font-semibold text-white hover:text-white hover:bg-primary-dark transition-all">
                                    Sign in
                                </a>
                            </Link>
                        </div>}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;