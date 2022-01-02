import {useSelector} from 'react-redux';

const useBadges = ()=>{
    return useSelector((state)=>{
        return {
            badges: state.badge.badges,
        }
    });
};


export const BadgeHook = {
    useBadges
};