import Fetch from '../../services/Fetch';
import { RawBadge } from '../types';
import store from '../store';
import * as BadgeActions from './slice';

const seen = async (badge_id: number, storex = store) => {
    await Fetch.postWithAccessToken('/api/badge/seen', {id: badge_id}) 
    return storex.dispatch(BadgeActions.seen(badge_id));
}


const init = async (storex = store) => {
    const badges = await Fetch.postWithAccessToken<{badges: RawBadge[]}>('/api/badge/init', {});
    return storex.dispatch(BadgeActions.init(badges.data.badges));
}


const onSubmitted = async (storex = store) => {
    const badges = await Fetch.postWithAccessToken<{badges: RawBadge[]}>('/api/badge/onsubmit', {}) 
    return storex.dispatch(BadgeActions.load(badges.data.badges));
}

export const BadgeFunctions = {
    seen,
    onSubmitted,
    init
};