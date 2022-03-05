
import Constants, { Code, LAYOUT_TYPES } from "../../../../Constants";
import { useState ,useEffect, useRef} from "react";
import Fetch from "../../../../services/Fetch";
import { Helper } from "../../../../services/Helper";
import { RawChallenge, RawPodcast } from "../../../../store/types";
import { round } from "lodash";
import {useParams ,Link} from "react-router-dom";
import ChallengeForm from "../../../../page.components/challenges/ChallengeForm";

interface ListPodcast {
    podcast : RawPodcast,
    point: any
}

interface DateTime{
    time_start: string,
    date_start: string,
    time_end: string,
    date_end: string,
}
interface Data{
    challenge: RawChallenge,
    date_time: DateTime,
    list_podcast:ListPodcast[],
    hour_d: string,
    minute_d: string,
    is_create: boolean
}
const Edit = ()=>{
    const {id} = useParams();
    const [data, setData ] = useState<Data>();
    useEffect(()=>{
    (async()=>{
        const res = await Fetch.postJsonWithAccessToken<{challenge:RawChallenge,podcasts:RawPodcast[]}>('/api/challenges/detail', {
            id:id, is_admin: true
        });
        console.log(res.data);
        const {challenge, podcasts} = res.data;
        const {limit_podcast,limit_time} = challenge.challenge_type;
        let list_podcast :ListPodcast[] = [];
        if(limit_podcast.status){
            const podcast_challenge = limit_podcast.podcasts;
            for(const podcast of podcasts){
                for(const item of podcast_challenge){
                    if(item.id == podcast.id){
                        list_podcast.push({
                            podcast: podcast,
                            point: item.point
                        })
                    }
                }
            }
        }

        setData({
            date_time:{
                time_start: Helper.getHourMinute(challenge.start_time),
                date_start: Helper.getDateInputFormat(challenge.start_time),
                time_end: Helper.getHourMinute(challenge.end_time),
                date_end: Helper.getDateInputFormat(challenge.end_time),
            },
            hour_d: round(limit_time.value/3600)+"",
            minute_d: (limit_time.value-round(limit_time.value/3600)*3600)/60+"",
            list_podcast: list_podcast,
            challenge: challenge,
            is_create: false
        });
    })();
    },[])
    return <>
        {data && <ChallengeForm {...data}/>}
    </>
}


Edit.layout=LAYOUT_TYPES.Admin;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const res = await Fetch.postJsonWithAccessToken<any>('/api/challenges/detail', {
//         id: context.params ? (context.params)['id'] : 0
//     })
//     return {

//         props: { challenge: res.data.challenge },
//     }
// }

export default Edit;