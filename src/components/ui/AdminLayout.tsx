import { ReactElement, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { MediaQuery } from "../../Constants";
import { FiMenu } from 'react-icons/fi';
import SidebarAdmin from "../sidebar/SidebarAdmin";
import { FetchLoading } from "../loading/FetchLoading";
import Navbar from "../navbar/Navbar";
import { StyleHook } from '../../store/style/hooks';

const AdminLayout = ({children}:{children: ReactElement}) => {
    const [openSidebar, setOpenSidebar] = useState(true);
    const isSemiMedium = useMediaQuery({ query: MediaQuery.isLg }, undefined, (matches) => {
        if (matches) {
            setOpenSidebar(true);
        }
        else {
            setOpenSidebar(false);
        }
    });
    const style = StyleHook.useStyle();

    return (<>
        <Navbar/>
        <FetchLoading/>
        <div className="flex w-full items-stretch"
            style={{backgroundColor: style.bg_color,
                    font: style.text_font,
                    minHeight: window.innerHeight,
                    color: style.text_color}}>
            <SidebarAdmin openSidebar={openSidebar} closeSidebar={() => setOpenSidebar(false)} />
            <div className={`pt-10 ${openSidebar ? "lg:w-3/4 semi-lg:w-10/12 " : ""} w-full`}>
                <div className="px-5 2xl:px-16">
                    <div className="pt-5 pb-3">
                        <div className="mb-3 flex fixed z-5">
                            <a onClick={() => setOpenSidebar(!openSidebar)}
                                className="flex hover:text-primary-dark bg-white
                            items-center text-xl cursor-pointer px-1.5 py-1.5 rounded-full shadow-md"><span><FiMenu /></span></a>
                        </div>
                    </div>
                    <div className="relative mt-7">
                       {children}
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default AdminLayout;