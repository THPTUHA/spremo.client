import { useState } from 'react';
import { BsExclamationLg } from 'react-icons/bs';
import {SettingHook} from '../../store/setting/hooks';
import {SettingFunctions} from '../../store/setting/function';
import Music from '../music/Music';
import { StyleHook } from "../../store/style/hooks";

const Setting = ({is_on_navbar}:{ is_on_navbar?: boolean})=>{
    const {settings} = SettingHook.useSetting();
    const [open_reminder, setReminder] = useState(false);
    const style = StyleHook.useStyle(); 
    
    return (
        <div className='z-50 text-white'>
            {
                settings.map(setting =>(
                    <div key={setting.id}>
                        {
                            (setting.action == "listen_music") &&  setting.blogs &&setting.blogs.length && setting.is_active &&
                            <div className='fixed right-5 bottom-5 bg-gray-800 rounded' >
                                <div onClick={()=>{SettingFunctions.toggleSetting(settings,setting.id)}}
                                    className="cursor-pointer mr-5 w-full flex justify-end"
                                    >
                                    <span className='mr-4'>Hide</span>
                                </div>
                                <Music blog={setting.blogs[0]}/>
                            </div>
                        }
                        {
                            (setting.action == "reminder") &&  is_on_navbar &&
                            <div className='relative w-full'>
                                <BsExclamationLg 
                                    onClick={()=>{setReminder(!open_reminder)}}
                                    className="w-8 h-auto cursor-pointer"    
                                />
                                {open_reminder && 
                                    <div className='absolute mt-3  flex rounded px-3 py-1'
                                        style={{backgroundColor: style.bg_blog_color, minWidth:200}}
                                    >
                                        {setting.data.reminder}
                                    </div>
                                }
                            </div>
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default Setting;