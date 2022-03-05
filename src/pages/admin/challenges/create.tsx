import Constants, { Code, LAYOUT_TYPES } from "../../../Constants";
import { Helper } from "../../../services/Helper";
import ChallengeForm from "../../../page.components/challenges/ChallengeForm";
import { RawChallenge } from "../../../store/types";

const Create = ()=>{
    const challenge = {
        id: 0,
        user_id: 0,
        metatype:"",
        data: "",
        name: "",
        description: "",
        start_time:0,
        end_time: 0,
        since: 0,
        last_update: 0,
        status: "",
        podcast_ids: [],
        number_member:0,
        podcasts: [],
        is_join: false,
        background_image:"",
        challenge_type:{
            team : {
                status:false , 
                number_member: 0
            },
            limit_time : {
                status:false ,
                value: 0
            },
            limit_podcast : {
                status:false ,
                podcasts:[] as {  id:number,
                    point:number
                }[]
            }
        },
    } as RawChallenge;
    
    const data = {
        date_time:{
            time_start: "00:00",
            date_start: Helper.getDateInputFormat(),
            time_end: "00:00",
            date_end: Helper.getDateInputFormat(),
        },
        list_podcast:[] ,
        challenge: challenge,
        hour_d: "0",
        minute_d: "0",
        is_create: true
    }
    return <ChallengeForm {...data}/>
}

Create.layout=LAYOUT_TYPES.Admin;
export default Create;