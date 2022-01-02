import store from '../store';
import * as LoadActions from './slice';

const setLoading = (value: boolean, progress: number, show_loading = true, storex= store) => {
    return storex.dispatch(LoadActions.loading({value, progress, show_loading: show_loading}));
} 

export const LoadingFunctions = {
    setLoading
};