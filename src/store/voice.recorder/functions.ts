import store from "../store";
import * as voiceRecoderSlice from './slice';

const open = (url: string,is_create:boolean,id: number,storex = store)=>{
    storex.dispatch(voiceRecoderSlice.open({url: url, is_create: is_create, id: id}));
}

const close = (storex = store)=>{
    storex.dispatch(voiceRecoderSlice.close());
}


export const VoiceRecoderFunction = {
    open,
    close
};