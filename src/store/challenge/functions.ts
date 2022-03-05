import Fetch from "../../services/Fetch";
import store from "../store";
import * as challengeSlice from './slice';
import {  RawChallenge } from "../types";
import { Code } from "../../Constants";
import { Helper } from "../../services/Helper";

const mapChallengeByPodcastId = (challenges: RawChallenge[])=>{
    const mapping :{[id:number]:RawChallenge[]}= {};
    for(const challenge of challenges){
        if(challenge.start_time <= Helper.time()){
            const podcast_ids = challenge.podcast_ids;
            if(podcast_ids.length){
                if(podcast_ids[0] == -1) mapping[0] = [challenge];
                else for(const id of podcast_ids)
                    if(mapping[id]) mapping[id].push(challenge)  ;
                    else mapping[id] = [challenge];
            }
        }
    }
    return mapping;
}

const mapChallengeById = (challenges: RawChallenge[])=>{
    const mapping :{[id:number]:RawChallenge}= {};
    for(const challenge of challenges){
        mapping[challenge.id] = challenge;
    }
    return mapping;
}

const loadRawChallenges = async (storex = store) => {
    try {
        console.log("Challenge fetch")
        const res = await Fetch.post<{challenges: RawChallenge[],code: number}>('/api/challenges/get', {});

        if (res.data && res.data.code === Code.SUCCESS) {
            return storex.dispatch(challengeSlice.loadChallenges({
                map_challenge_by_podcast_id: mapChallengeByPodcastId(res.data.challenges),
                map_challenge_by_id: mapChallengeById(res.data.challenges)
            }));
        }
    } catch (error) {
         console.log(error);
    }
};

const loadChallenges = (challenges: RawChallenge[],storex = store)=>{
    console.log(challenges);
    return storex.dispatch(challengeSlice.loadChallenges({
        map_challenge_by_podcast_id: mapChallengeByPodcastId(challenges),
        map_challenge_by_id: mapChallengeById(challenges)
    }));
}

export const ChallengeFunctions = {
    loadRawChallenges,
    loadChallenges,
};