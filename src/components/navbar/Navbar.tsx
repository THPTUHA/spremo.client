import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BsFillSquareFill, BsChevronExpand } from 'react-icons/bs';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { IoNotificationsOffOutline, IoNotificationsOutline, IoSearch } from 'react-icons/io5';
import { MdNotifications } from 'react-icons/md';
import { GrUserAdmin } from 'react-icons/gr';
import { CgProfile } from 'react-icons/cg';
import { SiTarget } from 'react-icons/si';
import SearchItem from './SearchItem';
import Avatar from '../../components/ui/Avatar';

import { CSSTransition } from 'react-transition-group';

import OutsideClickDetection from '../../components/ui/OutsideClickDetection';
// import Link from 'next/link';
import CurrentUser from '../../services/CurrentUser';
import { AiFillHome } from 'react-icons/ai';
import { FiActivity, FiLogOut } from 'react-icons/fi';
import { BsFillBarChartFill, BsMusicNoteList } from 'react-icons/bs';
import { MeHook } from '../../store/me/hooks';
import { MeFunctions } from '../../store/me/functions';
import { RawChallenge, RawNotification, RawUser } from '../../store/types';
import { useLocation ,Link} from 'react-router-dom';
import { Helper } from '../../services/Helper';
import firebase from 'firebase';
import { useAsync, useAsyncFn } from 'react-use';
import Fetch from '../../services/Fetch';

//@ts-ignore
import Constants, { FIREBASE_CONFIG } from '../../Constants';
import { RiFileUserLine } from 'react-icons/ri';
import { ChallengeHook } from '../../store/challenges/hooks';
import { ChallengeFunctions } from '../../store/challenges/functions';

const links = [
    { name: 'Home', link: '/', icon: <AiFillHome /> },
    { name: 'Podcasts', link: '/podcasts', icon: <BsMusicNoteList /> },
    { name: 'Newsfeed', link: '/news-feed', icon: <FiActivity /> },
    { name: 'Leaderboard', link: '/billboard', icon: <BsFillBarChartFill /> },
    { name: 'Challenges', link: '/challenges', icon: <SiTarget/> }
]



const Navbar = () => {
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [notifications, setNotifications] = useState<{ [key: number]: any }>({});
    const [unseen, setUnseen] = useState(0);
    const [system_unseen, setSystemUnseen] = useState(0);

    const [open_nav, setOpenNav] = useState(false);
    const [open_user_menu, setOpenUserMenu] = useState(false);
    const location = useLocation();
    const me = MeHook.useMe();
    const logout = useCallback(() => {
        setOpenUserMenu(false);
        MeFunctions.logout();
    }, [me])

    // const challenges = ChallengeHook.useRawChallenge();

    let observer: () => void;
    let system_observer: () => void;

    const state = useAsync(async () => {
        if (me) {
            if (firebase.apps.length === 0) {
                await firebase.initializeApp(FIREBASE_CONFIG);
            }
            const notificationQuery = firebase.firestore().collection("notifications").doc(CurrentUser.getUser()?.id.toString()).collection("notifications");
            const query = notificationQuery.orderBy("since", "desc").limit(10);
            observer = query.onSnapshot(async querySnapShot => {
                querySnapShot.docChanges().forEach(change => {

                    if (change.type == 'added') {
                    }

                    if (change.type == 'modified') {
                    }

                    if (change.type == 'removed') {
                    }
                });

                const res = await Fetch.postWithAccessToken<{ unseen: number }>('/api/notification/get.unseen', {});
                if (res.status == 200) {
                    setUnseen(res.data.unseen);
                }
            })
        }
        else {
            if (observer) {
                observer();
            }
        }
    }, [me])

    const state2 = useAsync(async () => {
        if (me) {
            if (firebase.apps.length === 0) {
                await firebase.initializeApp(FIREBASE_CONFIG);
            }
            const notificationQuery = firebase.firestore().collection("notifications").doc((-1).toString()).collection("notifications");
            const query = notificationQuery.orderBy("since", "desc").limit(10);
            system_observer = query.onSnapshot(async querySnapShot => {
                querySnapShot.docChanges().forEach(change => {
                    if (change.type == 'added') {
                    }
                    if (change.type == 'modified') {
                    }
                    if (change.type == 'removed') {
                    }
                });

                var res = await Fetch.postWithAccessToken<{ unseen: number }>("/api/notification/get.system.unseen", {});
                if (res.status == 200) {
                    setSystemUnseen(res.data.unseen);
                }
            })
        }
        else {
            if (system_observer) {
                system_observer();
            }
        }
    }, [me])

    return (
        <>
            <nav className=" z-40 fixed left-0 top-0 w-full shadow">
                <div className="relative flex justify-between items-center px-5 2xl:px-20 sm:px-10 bg-white">
                    <div className="flex items-center">
                        <div className="mr-4 flex semi-md:none">
                            <span className="text-2xl cursor-pointer text-primary"
                                onClick={() => setOpenNav(!open_nav)}
                            >
                                {open_nav ? <HiOutlineX /> : <HiOutlineMenu />}
                            </span>
                        </div>

                        {/* <Link href="/"> */}
                        <Link to="/">
                            <a className="flex items-center text-xl xs:mr-5 text-primary hover:text-primary">
                                <img src="/static/logo.png" className=" h-10" alt="" />
                            </a>

                        </Link>
                        <ul className="none semi-md:flex">
                            {links.map((item, index) => (
                                <li key={index} className="transition-all font-medium text-gray-800">
                                    {/* <Link href={`${item.link}`}> */}
                                    <Link to={`${item.link}`}>
                                        <a className={`
                                        ${location.pathname === item.link ? 'text-primary' : ''}
                                        transition-all flex items-center px-3 py-3.5 box-border text-sm 
                                        hover:text-gray-800 border-b-2 border-transparent hover:border-primary `}>
                                            <span>{item.name}</span>
                                            <span className="ml-2 text-lg">{item.icon}</span>
                                        </a>

                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="items-center flex">
                        <div className="none semi-xs:flex items-center bg-gray-100 rounded-lg my-2 ">
                            <label className="pr-2.5 pl-2 py-2 cursor-pointer" htmlFor="search"><IoSearch /></label>
                            <SearchItem url={"podcasts"}/>
                        </div>
                        {CurrentUser.getUser() ? <div className="ml-3 py-1 flex items-center relative">
                            <div className="relative">
                                <Link to="/notifications" >
                                    <a className="relative cursor-pointer">
                                        <span className="flex items-center justify-center px-2 py-1.5 text-lg bg-primary text-white rounded-lg"
                                        ><MdNotifications /></span>
                                        {(unseen + system_unseen > 0) && <span className="absolute -top-2 -right-2 text-white font-medium bg-red-700 text-sm flex justify-center items-center w-6 h-6 rounded-full">
                                            {unseen + system_unseen}</span>}
                                    </a>
                                </Link>
                            </div>
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
                                                {/* <Link href="/admin/podcasts" > */}
                                                <Link to="/admin/podcasts" >
                                                    <a className="hover:bg-gray-200 rounded-lg px-2 py-1 cursor-pointer flex items-center text-gray-800 hover:text-gray-600 transition-all">
                                                        <span className="mr-1"><GrUserAdmin /></span>
                                                        <span>Admin</span>
                                                    </a>
                                                </Link>
                                            </>)}
                                            <Link to="/record">
                                                <a className="hover:bg-gray-200 rounded-lg px-2 py-1 cursor-pointer flex items-center text-gray-800 hover:text-gray-600 transition-all">
                                                    <span className="mr-1"><CgProfile /></span>
                                                    <span>Profile</span>
                                                </a>
                                            </Link>
                                            <Link to={`/profile/${Helper.generateCode(me ? me.fullname : "")}/${me?.id}`}>
                                                <a className="hover:bg-gray-200 rounded-lg px-2 py-1 cursor-pointer flex items-center text-gray-800 hover:text-gray-600 transition-all">
                                                    <span className="mr-1"><RiFileUserLine /></span>
                                                    <span>Trang cá nhân</span>
                                                </a>
                                            </Link>
                                            <Link to="/notifications">
                                                <a className=" hover:bg-gray-200 rounded-lg px-2 py-1 cursor-pointer flex items-center text-gray-800 hover:text-gray-600 transition-all">
                                                    <span className="mr-1"><IoNotificationsOutline /></span>
                                                    <span className="flex">
                                                        <span>Notifications</span>
                                                        <span className="bg-primary rounded-full ml-2 text-white text-xs font-medium flex justify-center items-center h-6 w-6">
                                                            {unseen + system_unseen > 0 ? unseen + system_unseen : 0}
                                                        </span>
                                                    </span>
                                                </a>
                                            </Link>
                                            <span onClick={logout} className="hover:bg-gray-200 rounded-lg px-2 py-1 cursor-pointer flex items-center text-gray-800 hover:text-gray-600 transition-all">
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
                    <CSSTransition
                        in={open_nav}
                        timeout={300}
                        classNames="dropdown-navbar"
                        unmountOnExit
                    >
                        <div style={{ zIndex: -1 }} className=" bg-white shadow w-full absolute top-full left-0 block semi-md:none">

                            <OutsideClickDetection outsideFunc={() => setOpenNav(false)}>
                                <ul className="p-0">
                                    <li className="px-5 semi-xs:none py-2">
                                        <div className="flex w-full bg-gray-50 rounded-md">
                                            <label className="pr-2.5 px-2 py-2" htmlFor="search"><IoSearch /></label>
                                            <input id="search" className="focus:outline-none w-full bg-transparent"
                                                type="text" placeholder="Search..." />
                                        </div>
                                    </li>
                                    {links.map((item, index) => (
                                        <li key={index} className="
                                            text-base m-0 transition-all font-medium 
                                            text-gray-800">
                                            <Link to={`${item.link}`}>
                                                <a className="inline-block pl-5 sm:pl-10 py-2 transition-all hover:text-gray-800 hover:bg-gray-100 w-full">
                                                    {item.name}
                                                </a>

                                            </Link>
                                        </li>
                                    ))}

                                </ul>
                            </OutsideClickDetection>
                        </div>
                    </CSSTransition>
                </div>
            </nav>
        </>
    )
}

export default Navbar;