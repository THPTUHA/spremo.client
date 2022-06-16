import AutoActiveLink from '../../components/ui/ActiveLink';
import { CSSTransition } from 'react-transition-group';
import {IoLayersOutline,  IoNewspaperOutline} from 'react-icons/io5';
import { FiUsers } from 'react-icons/fi';
import { BsFillFileEarmarkPostFill } from 'react-icons/bs';
import { MeHook } from '../../store/me/hooks';
import { ROLES } from '../../Constants';
import { StyleHook } from '../../store/style/hooks';

const SidebarAdmin = ({ openSidebar, closeSidebar }: { openSidebar: boolean, closeSidebar: () => void }) => {
    const me = MeHook.useMe();
    return (<>
        {openSidebar ? <div onClick={() => closeSidebar()}
            className="fixed lg:none z-10 h-screen w-screen bg-gray-900 opacity-50"></div> : <></>}
        <div className="absolute top-0 left-0 h-screen " >
            <CSSTransition
                in={openSidebar}
                timeout={300}
                classNames="admin-sidebar"
                unmountOnExit={true}
            >
                <div className="semi-lg:w-2/12 z-10 md:w-1/4 sm:w-1/3 xs:w-1/2 w-2/3 box-border 
                                        pt-10 shadow-lg h-full fixed scrollbar-thin scrollbar-thumb-primary scrollbar-track-white overflow-y-auto">

                    <div className="pl-5 pt-5 w-full pr-5 flex flex-col h-full justify-between border-r-2 border-white">
                        <ul className="">
                            <li className="mb-2 mt-3 font-semibold">Tasks</li>

                            {
                                me && me.role == ROLES.ADMIN && (
                                    <AutoActiveLink href={`/admin/users/all`}>
                                        <>
                                            <span className="mr-1.5"><FiUsers/></span>
                                            <span className="">Users</span>
                                        </>
                                    </AutoActiveLink>
                                )
                            }
                            <AutoActiveLink href='/admin/blogs/all'>
                                <>
                                    <span className="mr-1.5"><BsFillFileEarmarkPostFill/></span>
                                    <span className="">Blogs</span>
                                </>
                            </AutoActiveLink>

                            {/* <li className="mb-2 mt-3 font-semibold">Settings</li> */}

                        </ul>
                    </div>
                </div>

            </CSSTransition>
        </div>
        <div className={` ${openSidebar ? "lg:w-1/4 semi-lg:w-2/12" : ""} w-0`}></div>
    </>)
}

export default SidebarAdmin;