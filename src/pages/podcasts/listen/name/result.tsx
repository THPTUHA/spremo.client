import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import Fetch from '../../../../services/Fetch';
import { Helper } from '../../../../services/Helper';
import { RawPodcast, RawPodcastSubmit ,RawPodcastChallenge} from '../../../../store/types';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import Result from '../../../../page.components/listen/Result';
import Meta from '../../../../components/ui/Meta';
import { useParams } from 'react-router-dom';
import { Code } from '../../../../Constants';
import { Toast } from '../../../../services/Toast';


interface Props {
    podcast: RawPodcast,
    podcast_submit: RawPodcastSubmit
}

interface Response {
    podcast: RawPodcast,
    podcast_submit: RawPodcastSubmit,
    user_record: RawPodcastChallenge,
    code: number,
    metatype:{
        id:number,
        challenge_id: number,
        challenge_name: string
    }
    message:string 
}

const ListenResult = () => {
    const {id} = useParams();
    const [response, setResponse] = useState<Response>();

    useEffect(()=>{
        (async()=>{
           try {
                console.log(id);
                const ids = id?.split("_");
                let url = '/api/podcast.submit/detail';
                if(ids && ids[1]) url ='/api/record.challenge.user/podcast.result';
                const res = await Fetch.postWithAccessToken<Response>(url, {
                   id:ids && ids[0]?ids[0]:"",
                   challenge_id: ids && ids[1]?ids[1]:""
                });
                console.log(res.data);
                if(res.data && res.data.code == Code.SUCCESS){
                    setResponse(res.data);
                }
                else{
                    Toast.error(res.data.message);
                }
           } catch (error) {
               console.log(error);
               Toast.error("ERROR !");
           }        

        })();
    },[]);
    return (<>
        {
            response && (
                <div>
                    <Meta title={`WELE | Result ${response.podcast.name}`} />
                    <div className="w-full pt-16">
                        <Breadcrumb podcast={response.podcast}/>
                        <Result {...response} />
                    </div>
                </div>
            )
        }
    </>);
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const res = await Fetch.postJson<{ podcast_submit: RawPodcastSubmit, podcast: RawPodcast, code: number }>('/api/podcast.submit/detail', {
//         id: (context.params) ? (context.params)['id'] : 0,
//         access_token: Helper.getCookieFromReq("access_token", context.req.headers.cookie ? context.req.headers.cookie.toString() : "")
//     });



//     return {
//         props: {
//             podcast_submit: res.data.podcast_submit,
//             podcast: res.data.podcast
//         }
//     };
// }

export default ListenResult;