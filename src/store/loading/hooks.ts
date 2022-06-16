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

const useReloadTopUser = ()=>{
    return useSelector((state)=>{
        return {
           reload_top_user : state.loading.reload_top_user
        }
    });
}

export const LoadingHook = {
    useLoading,
    useReloadTopUser
};