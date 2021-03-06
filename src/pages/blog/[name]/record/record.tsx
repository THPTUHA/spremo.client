import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useAsync } from 'react-use';
import MyBlogLayout from '../../../../components/page/MyBlogLayout';
import { Code } from '../../../../Constants';
import DateUtil from '../../../../services/Date';
import Fetch from '../../../../services/Fetch';
import { Toast } from '../../../../services/Toast';
import { MeHook } from '../../../../store/me/hooks';
import { RawRecord } from '../../../../store/types';

interface Response{
    code: number,
    message: string,
    records: RawRecord[]
}

const Record = ()=>{
    const me = MeHook.useMe();
    const state = useAsync(async()=>{
        const range = DateUtil.getDayonWeek();

        var labels = range.map(e => {
            var date = new Date(e * 1000);
            return `${date.getDate()}/${date.getMonth() + 1}`
        });

        console.log("Lable",range);
        const likes = [];
        const comments = [];
        for(let i=0; i<range.length;++i){
            likes.push(0);
            comments.push(0);
        }
        try {
            const res = await Fetch.postJsonWithAccessToken<Response>("/api/me/record",{
                range: JSON.stringify(range)
            });

            if(res.data){
                const {code,message, records} = res.data;
                console.log(records);
                if(code == Code.SUCCESS){
                    for(let i=0; i<range.length;++i){
                        for(let j =0 ; j <records.length ; ++j){
                            if(range[i] == records[j].since){
                                likes[i] = records[j].like_number;
                                comments[i] = records[j].comment_number;
                                break;
                            }
                        }
                    }
                    return {
                        interaction :{
                            labels: labels,
                            datasets: [
                                {
                                    label: "Like",
                                    data: likes,
                                    fill: false,
                                    borderColor: 'rgb(255, 99, 132)',
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                },
                                {
                                    label: "Comment",
                                    data: comments,
                                    fill: false,
                                    borderColor: 'rgb(53, 162, 235)',
                                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                }
                            ]
                        }
                    }
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
        return {
            interaction :{
                labels: labels,
                datasets: [
                    {
                        label: "Like",
                        
                        data: likes,
                        fill: false,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                    {
                        label: "Comment",
                        data: comments,
                        fill: false,
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    }
                ],
                
            }
        }
    },[me])
    
    return (
        <MyBlogLayout>
             <div className='mr-10'>
                {
                    state.loading ? <div>Loading...</div>
                        : state.value && (
                            <div  className="text-white">
                                <Line 
                                    data={state.value.interaction} 
                                    type={""}  
                                    options={{
                                        legend:{
                                            fontColor: "white"
                                        },
                                        scales:{
                                            x:{
                                                ticks:{
                                                    color:"white"
                                                }
                                            },
                                            y:{
                                                ticks:{
                                                    color:"white"
                                                }
                                            }
                                        }
                                    }}
                                   />
                            </div>
                        )
                }
            </div>
        </MyBlogLayout>
    )
}

export default Record;
