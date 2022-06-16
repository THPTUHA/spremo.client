import store from '../store';
import * as LoadActions from './slice';

const setLoading = (value: boolean, progress: number, show_loading = true, storex= store) => {
    return storex.dispatch(LoadActions.loading({value, progress, show_loading: show_loading}));
} 

const reloadTopUser = ( storex= store)=>{
    return storex.dispatch(LoadActions.reloadTopUser());
}
export const LoadingFunctions = {
    setLoading,
    reloadTopUser
};