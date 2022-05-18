import {combineReducers} from 'redux';
import undoable from 'redux-undo';

import MeReducer from './me/slice';
import LoadingReducer from './loading/slice';
import PodcastCollectionReducer from './podcast.collection/slice';
import UserReducer from  './user/slice';
import PodcastReducer from './podcast/slice';
import BadgeReducer from  './badge/slice';
import CongratReducer from './congrat/slice';
import ChallengeReducer from './challenge/slice';

import StyleReducer from './style/slice';
import DrawReducer  from './draw/slice';
import DrawTookReducer from './draw.tool/slice';
import EmotionReducer from './emotion/slice';
import VoiceRecorderReducer  from './voice.recorder/slice';
import SocketReducer from './socket/slice';
import chatReducer from './chat/slice';

const appReducer = combineReducers({
    me: MeReducer,
    loading: LoadingReducer,
    podcastCollection: PodcastCollectionReducer,
    user: UserReducer,
    podcast:PodcastReducer,
    badge: BadgeReducer,
    congrat: CongratReducer,
    challenge: ChallengeReducer,
    style: StyleReducer,
    draw: undoable(DrawReducer),
    drawTool: DrawTookReducer,
    emotion: EmotionReducer,
    voiceRecorder: VoiceRecorderReducer,
    socket: SocketReducer,
    chat: chatReducer
});


export default appReducer;