import {useSelector} from 'react-redux';

const useLoading = ()=>{
    return useSelector((state:any)=>{
        return {
            progress: state.loading.progress,
            loading: state.loading.loading,
            show_loading: state.loading.show_loading
        }
    });
};


export const LoadingHook = {
    useLoading
};