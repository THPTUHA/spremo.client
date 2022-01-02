import AutoActiveLink from '../../components/ui/ActiveLink';
import { CSSTransition } from 'react-transition-group';
import {IoLayersOutline,  IoNewspaperOutline} from 'react-icons/io5';

const SidebarAdmin = ({ openSidebar, closeSidebar }: { openSidebar: boolean, closeSidebar: () => void }) => {
    return (<>
        {/* -- Sidebar -- */}
        {openSidebar ? <div onClick={() => closeSidebar()}
            className="fixed lg:none z-10 h-screen w-screen bg-gray-900 opacity-50"></div> : <></>}
        <div className="absolute top-0 left-0 h-screen">
            <CSSTransition
                in={openSidebar}
                timeout={300}
                classNames="admin-sidebar"
                unmountOnExit={true}
            >
                <div className="semi-lg:w-2/12 z-10 md:w-1/4 sm:w-1/3 xs:w-1/2 w-2/3 box-border
                                        pt-10 bg-white shadow-lg h-full fixed scrollbar-thin scrollbar-thumb-primary scrollbar-track-white overflow-y-auto">

                    <div className="pl-5 pt-5 w-full pr-5 flex flex-col h-full justify-between">
                        <ul className="">
                            <li className="mb-2 mt-3 font-semibold">Tasks</li>

                            <AutoActiveLink href='/admin/podcasts'>
                                <>
                                    <span className="mr-1.5"><IoNewspaperOutline/></span>
                                    <span className="">Podcasts</span>
                                </>
                            </AutoActiveLink>
                            <AutoActiveLink href='/admin/challenge'>
                                <>
                                    <span className="mr-1.5"><IoNewspaperOutline/></span>
                                    <span className="">Challenge</span>
                                </>
                            </AutoActiveLink>

                            <li className="mb-2 mt-3 font-semibold">Settings</li>

                            <AutoActiveLink href='/admin/collections'>
                                <>
                                    <span className="mr-1.5"><IoLayersOutline/></span>
                                    <span>Collections</span>
                                </>
                            </AutoActiveLink>

                            <AutoActiveLink href='/admin/users'>
                                <>
                                    <span className="mr-1.5"><IoLayersOutline/></span>
                                    <span>Users</span>
                                </>
                            </AutoActiveLink>

                            <AutoActiveLink href='/admin/certifications'>
                                <>
                                    <span className="mr-1.5"><IoLayersOutline/></span>
                                    <span>Certifications</span>
                                </>
                            </AutoActiveLink>
                            <AutoActiveLink href='/admin/notifications'>
                                <>
                                    <span className="mr-1.5"><IoLayersOutline/></span>
                                    <span>Notifications</span>
                                </>
                            </AutoActiveLink>

                            {/* <AutoActiveLink href='/admin/announcements'>
                                <>
                                    <span className="mr-1.5"><IoLayersOutline/></span>
                                    <span>Announcement</span>
                                </>
                            </AutoActiveLink> */}

                        </ul>
                    </div>
                </div>

            </CSSTransition>
        </div>
        <div className={` ${openSidebar ? "lg:w-1/4 semi-lg:w-2/12" : ""} w-0`}></div>
        {/* -- End Sidebar -- */}
    </>)
}

export default SidebarAdmin;