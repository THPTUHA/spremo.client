import  { useCallback, useMemo, useState } from 'react';
import { GrUserAdmin } from 'react-icons/gr';
import { CgProfile } from 'react-icons/cg';
import Avatar from '../../components/ui/Avatar';

import { CSSTransition } from 'react-transition-group';

import OutsideClickDetection from '../../components/ui/OutsideClickDetection';
import Link from 'next/link';
import CurrentUser from '../../services/CurrentUser';
import { FiLogOut } from 'react-icons/fi';
import { MeHook } from '../../store/me/hooks';
import { MeFunctions } from '../../store/me/functions';
import {  RawUser } from '../../store/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Constants from '../../Constants';
// import $ from 'jquery'
import { RiFileUserLine } from 'react-icons/ri';
import { Helper } from '../../services/Helper';

const Navbar = () => {
    const [open_user_menu, setOpenUserMenu] = useState(false);
    const router = useRouter();
    const me = MeHook.useMe();
    const logout = useCallback(() => {
        setOpenUserMenu(false);
        MeFunctions.logout();
    }, [me])

    // useEffect(() => {
    //     $(window).on("scroll", () => {
    //         if ($('html').scrollTop() && ($('html').scrollTop() as number) >= 100) {

    //             if (!$(".js-nav").hasClass("shadow")) {
    //                 $(".js-nav").addClass("shadow")
    //             }
    //         }
    //         else {
    //             if ($(".js-nav").hasClass("shadow")) {
    //                 $(".js-nav").removeClass("shadow");
    //             }
    //         }
    //     });

    //     return () => {
    //         $(window).off("scroll")
    //     }
    // }, [])

    return (
        <>
            <nav className=" z-40 fixed left-0 top-0 w-full js-nav transition-all">
                <div className="relative flex justify-between items-center px-5 2xl:px-20 sm:px-10 bg-white">
                    <div className="flex items-center">
                        <Link href="/">
                            <a className="flex items-center text-xl xs:mr-5 text-primary hover:text-primary">
                                <img src="/static/logo.png" className=" h-10" alt="" />
                            </a>

                        </Link>
                    </div>
                    <div className="items-center flex">
                        <Link href="/home" >
                            <a className="border border-primary text-primary hover:bg-primary hover:text-white transition-all px-2 xs:px-5 py-1 text-sm font-medium rounded">Go to App</a>
                        </Link>
                        {CurrentUser.getUser() ? <div className=" ml-1 xs:ml-3 py-1 none xs:flex items-center relative">
                            <OutsideClickDetection outsideFunc={() => setOpenUserMenu(false)}>
                                <div
                                    onClick={() => setOpenUserMenu(!open_user_menu)}
                                    className="ml-1 relative flex items-center cursor-pointer rounded-full hover:bg-primary-light py-1 px-1.5">

                                    <Avatar user={CurrentUser.getUser() as RawUser} />
                                    <span className="font-medium ml-1 text-base">{CurrentUser.getUser()?.fullname}</span>
                                    <CSSTransition
                                        in={open_user_menu}
                                        classNames="user-menu"
                                        unmountOnExit
                                        timeout={300}
                                    >
                                        <div className="absolute top-full w-48 right-0 rounded px-3 py-2 bg-white shadow">
                                            {me?.role === Constants.ROLES.Admin && (<>
                                                <Link href="/admin/podcasts" >
                                                    <a className="hover:bg-gray-200 rounded-lg px-2 py-1 cursor-pointer flex items-center text-gray-800 hover:text-gray-600 transition-all">
                                                        <span className="mr-1"><GrUserAdmin /></span>
                                                        <span>Admin</span>
                                                    </a>
                                                </Link>
                                            </>)}
                                            <Link href="/record">
                                                <a className="hover:bg-gray-200 rounded-lg px-2 py-1 cursor-pointer flex items-center text-gray-800 hover:text-gray-600 transition-all">
                                                    <span className="mr-1"><CgProfile /></span>
                                                    <span>Profile</span>
                                                </a>
                                            </Link>
                                            <Link href={`/profile/${Helper.generateCode(me ? me.fullname : "")}/${me?.id}`}>
                                                <a className="hover:bg-gray-200 rounded-lg px-2 py-1 cursor-pointer flex items-center text-gray-800 hover:text-gray-600 transition-all">
                                                    <span className="mr-1"><RiFileUserLine /></span>
                                                    <span>Trang cá nhân</span>
                                                </a>
                                            </Link>

                                           <Link href="/">
                                            <span onClick={logout} className="hover:bg-gray-200 rounded-lg px-2 py-1 cursor-pointer flex items-center text-gray-800 hover:text-gray-600 transition-all">
                                                <span className="mr-1"><FiLogOut /></span>
                                                <span>Logout</span>
                                            </span>
                                           </Link>
                                        </div>
                                    </CSSTransition>
                                </div>



                            </OutsideClickDetection>
                        </div> : <div className="ml-3 py-2 none xs:flex items-center">
                            <Link href={'/authentication/register'}>
                                <a className="text-sm inline-block rounded-sm text-center bg-primary-light px-2 py-1.5  font-semibold text-primary-dark hover:text-white hover:bg-primary-dark transition-all">
                                    Sign up
                                </a>

                            </Link>
                            <Link href={'/authentication/login'}>
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