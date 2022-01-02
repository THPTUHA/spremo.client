import { ReactElement, useState } from "react";
import Meta from "./Meta"
import NavbarAdmin from '../../components/navbar/NavbarAdmin';
import { useMediaQuery } from "react-responsive";
import { MediaQuery } from "../../Constants";
import { FiMenu } from 'react-icons/fi';

import SidebarAdmin from "../../components/sidebar/SidebarAdmin";
import { FetchLoading } from "../../components/loading";

const LayoutAdmin = ({children}:{children: ReactElement}) => {
    const [openSidebar, setOpenSidebar] = useState(true);
    const isSemiMedium = useMediaQuery({ query: MediaQuery.isLg }, undefined, (matches) => {
        if (matches) {
            setOpenSidebar(true);
        }
        else {
            setOpenSidebar(false);
        }
    });
    return (<>
        <Meta />
        <NavbarAdmin />
        <FetchLoading/>
        <div className="flex w-full items-stretch">
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

export default LayoutAdmin;