import Fetch from "../../services/Fetch";
import store from "../store";
import * as podcastCollectionSlice from './slice';
import { RawPodcastCollection } from "../types";
import { Code } from "../../Constants";


const loadAll = async (storeX = store) => {
    try{
        const res = await Fetch.post<{ code: number, podcast_collections: RawPodcastCollection[]}>("/api/podcast.collection/list", {});

        const collections = res.data.podcast_collections;

        if (res.data && res.data.code === Code.SUCCESS){
            return  storeX.dispatch(podcastCollectionSlice.loadCollections(collections))
        } else {
            return storeX.dispatch(podcastCollectionSlice.loadCollections([]));
        }
    }
    catch (err){
        console.log(err);
    }
}

export const PodcastCollectionFunctions = {
    loadAll
};