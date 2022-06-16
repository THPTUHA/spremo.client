import {combineReducers} from 'redux';
import undoable from 'redux-undo';

import MeReducer from './me/slice';
import LoadingReducer from './loading/slice';

import StyleReducer from './style/slice';
import DrawReducer  from './draw/slice';
import DrawTookReducer from './draw.tool/slice';
import EmotionReducer from './emotion/slice';
import VoiceRecorderReducer  from './voice.recorder/slice';
import SocketReducer from './socket/slice';
import chatReducer from './chat/slice';
import settingReducer from './setting/slice';

const appReducer = combineReducers({
    me: MeReducer,
    loading: LoadingReducer,
    style: StyleReducer,
    draw: undoable(DrawReducer),
    drawTool: DrawTookReducer,
    emotion: EmotionReducer,
    voiceRecorder: VoiceRecorderReducer,
    socket: SocketReducer,
    chat: chatReducer,
    setting: settingReducer,
});


export default appReducer;