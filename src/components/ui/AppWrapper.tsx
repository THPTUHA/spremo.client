// import LoadingAbsolute from "../loading";
import { ReactElement, useEffect, useState } from "react";
import Startup from "../../Startup";
import LoadingSmile from "../loading/LoadingSmile";



const AppWrapper = ({ children }: { children: ReactElement }) => {
    const [isFullyLoaded, setFullyLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            await Startup.init();
            await setFullyLoaded(true);
        })()

    }, [])


    return (<>
        {isFullyLoaded?children : <LoadingSmile/>}
    </>)
}

export default AppWrapper;