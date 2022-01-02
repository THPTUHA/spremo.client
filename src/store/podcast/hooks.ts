import {useSelector} from 'react-redux';
import { useAsync } from 'react-use';
import Fetch from "../../services/Fetch";
import { RawPodcast } from '../types';
import { PodcastFunctions } from './functions';

const useAll = ()=> {
    return useSelector((state) => {
        return state.podcast.podcasts;
    });
}

const useFetchPodcasts = (ids: number[]): RawPodcast[] => {
    const state = useAsync(async() => {
        if (!ids) {
            return [];
        }
        const res = await Fetch.postWithAccessToken<{podcasts: RawPodcast[]}>('/api/podcasts/ids', {
            ids: ids.join(',')
        }, []);

        if (res.data.podcasts) {
            PodcastFunctions.loadRawPodcasts(res.data.podcasts);
        }
        return res.data.podcasts;
    }, [ids.join(',')]);
    

    if (!state.value || state.error) {
        return []
    }

    return state.value;
};


const usePodcast = (podcast_id: number)=> {
    return useSelector((state) => {
        return state.podcast.podcasts[podcast_id];
    });
}



export const PodcastHook = {
    useAll,
    useFetchPodcasts,
    usePodcast,
}