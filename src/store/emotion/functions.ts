import Fetch from '../../services/Fetch';
import { Code } from '../../Constants';
import store from '../store';
import * as EmtionActions  from './slice';
import { Toast } from '../../services/Toast';
import { StyleFunctions } from '../style/functions';

const init = async(storex = store)=>{
    try {
        const res = await Fetch.postJsonWithAccessToken<{code: number,message: string, emotion_id:number,is_change:boolean}>("/api/emotion/get",{});
        if(res.data){
            const {code,message, emotion_id,is_change} = res.data;

            if(code == Code.SUCCESS){
                storex.dispatch(EmtionActions.changeEmtion({id:emotion_id, is_change:is_change}))
                StyleFunctions.setStyle(emotion_id);
            }else{
                Toast.error(message);
            }
        }
    } catch (error) {
        console.log(error);
        Toast.error("ERROR!!");
    }
}

const set = async(status: number,storex = store)=>{
    try {
        const res = await Fetch.postJsonWithAccessToken<{code: number,message: string, emotion_id:number,is_change:boolean}>("/api/emotion/update",{
            status: status
        });
        if(res.data){
            const {code,message, emotion_id} = res.data;

            if(code == Code.SUCCESS){
                storex.dispatch(EmtionActions.changeEmtion({id:emotion_id, is_change: false}))
                StyleFunctions.setStyle(emotion_id);
            }else{
                Toast.error(message);
            }
        }
    } catch (error) {
        console.log(error);
        Toast.error("ERROR!!");
    }
}

const openModal = (storex = store)=>{
    storex.dispatch(EmtionActions.readyChange(true))
}

export const EmtionFunctions = {
    init,
    set,
    openModal
};