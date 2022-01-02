import Fetch from "../../services/Fetch";
import store from "../store";
import * as podcastSlice from './slice';
import {  RawPodcast } from "../types";
import * as _ from 'lodash';


const loadRawPodcasts = async (podcasts: RawPodcast[], storex = store) => {
    return storex.dispatch(podcastSlice.loadPodcasts(_.fromPairs(podcasts.map(e => [e.id, e]))))
};

const loadPodcastByIds = async (ids: number[]) => {
    if(ids.length){
        console.log("FECTH");
        const res = await Fetch.postWithAccessToken<{podcasts: RawPodcast[]}>('/api/podcasts/ids', {
            ids: _.union(ids).join(',')
        }, []);
    
        if (res.data.podcasts) {
            loadRawPodcasts(res.data.podcasts);
        }
    }
};

const loadPodcast = async (podcast: RawPodcast, storeX = store) => {
    return storeX.dispatch(podcastSlice.loadPodcast({ podcast }))

};

export const PodcastFunctions = {
    loadPodcast,
    loadRawPodcasts,
    loadPodcastByIds
};