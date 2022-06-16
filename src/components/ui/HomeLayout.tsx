import Navbar from '../navbar/Navbar';
import { ReactElement } from "react";
import { StyleHook } from '../../store/style/hooks';
import { FetchLoading } from '../loading/FetchLoading';
import Chat from '../chat/Chat';
import Setting from '../setting/Setting';

const HomeLayout = ({children}:{children: ReactElement})=>{
    const style = StyleHook.useStyle();
    return (
        <div>
            <FetchLoading/>
            <Navbar/>
            <Chat/>
            <Setting/>
            <div className='absolute w-full pt-10' 
                style={{backgroundColor: style.bg_color,
                        font: style.text_font,
                        minHeight: window.innerHeight,
                        color: style.text_color}} >
                {children}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" style={{display: "none"}}>
                <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 4" id="eye">
                    <path d="M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1"></path>
                </symbol>
                <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 7" id="mouthsm">
                    <path d="M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5"></path>
                </symbol>
            </svg>
        </div>
    )
}

export default HomeLayout;