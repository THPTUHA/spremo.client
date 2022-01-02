import {useSelector} from 'react-redux';

const useAll = ()=> {
    return useSelector((state) => {
        return state.podcastCollection.collections;
    });
}


export const PodcastCollectionHook = {
    useAll
}