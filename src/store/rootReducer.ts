import {combineReducers} from 'redux';

import MeReducer from './me/slice';
import LoadingReducer from './loading/slice';
import PodcastCollectionReducer from './podcast.collection/slice';
import UserReducer from  './user/slice';
import PodcastReducer from './podcast/slice';
import BadgeReducer from  './badge/slice';
import CongratReducer from './congrat/slice';
import ChallengeReducer from './challenge/slice';

const appReducer = combineReducers({
    me: MeReducer,
    loading: LoadingReducer,
    podcastCollection: PodcastCollectionReducer,
    user: UserReducer,
    podcast:PodcastReducer,
    badge: BadgeReducer,
    congrat: CongratReducer,
    challenge: ChallengeReducer
});


export default appReducer;