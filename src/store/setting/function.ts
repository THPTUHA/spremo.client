import { Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import store from "../store";
import { RawBlog, RawSetting } from "../types";
import * as SettingActions  from './slice';

const init = async(emotion_id: number,storex = store)=>{
    try {
        const res = await Fetch.postJsonWithAccessToken<{code: number,message: string, settings: RawSetting[]}>("/api/me/setting.list",{
            emotion_id: emotion_id
        });
        if(res.data){
            const {code,message, settings} = res.data;

            if(code == Code.SUCCESS){
                for(const setting of settings){
                    setting.is_active = true;
                }
                storex.dispatch(SettingActions.set({settings}))
            }else{
                Toast.error(message);
            }
        }
    } catch (error) {
        console.log(error);
        Toast.error("ERROR!!");
    }
}

const toggleSetting = (settings: RawSetting[],setting_id: number,storex = store)=>{
    // console.log("Setting_id", setting_id);
    const new_settings: RawSetting[] = [] ;
    for(const setting of settings){
        const new_setting = {...setting};
        if(new_setting.id == setting_id){
            new_setting.is_active = new_setting.is_active ? false : true;
        }

        new_settings.push(new_setting);
    }
    storex.dispatch(SettingActions.set({settings: new_settings}));
}

const reset = (storex = store)=>{
    storex.dispatch(SettingActions.set({settings: []}));
}
export  const SettingFunctions ={
    init,
    reset,
    toggleSetting
}