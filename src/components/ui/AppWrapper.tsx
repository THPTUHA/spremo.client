import LoadingAbsolute from "../loading";
import { ReactElement, useEffect, useState } from "react";
import Startup from "../../Startup";



const AppWrapper = ({ children }: { children: ReactElement }) => {
    const [isFullyLoaded, setFullyLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            await Startup.init();
            await setFullyLoaded(true);
        })()

    }, [])


    return (<>
        {!isFullyLoaded && <LoadingAbsolute />}
        {children}
    </>)
}

export default AppWrapper;