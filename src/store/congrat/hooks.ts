import {useSelector} from 'react-redux';

const useCongrat = ()=>{
    return useSelector((state)=>{
        return {
            congrat: state.congrat.congrat_msg,
        }
    });
};


export const CongratHook = {
    useCongrat
};