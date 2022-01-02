import { ReactElement, useEffect } from "react";
// import Navbar from '../../components/navbar/HomeNavbar';
import Navbar from '../../components/navbar/Navbar';
// import { FetchLoading } from "../../components/loading";
const Layout = ({children}:{children:ReactElement})=> {
    return (<>
        <Navbar />
        {/* <FetchLoading/> */}
        {children}
    </>)
}

export default Layout;