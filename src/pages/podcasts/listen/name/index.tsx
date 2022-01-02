import { FaChevronRight, FaHeadphonesAlt, FaChevronLeft, FaPlay } from 'react-icons/fa'
import { IoPause, IoRepeat } from 'react-icons/io5'
import { FiBookmark } from 'react-icons/fi'
// import { List, arrayMove } from 'react-movable';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import $ from 'jquery';
import {  useEffect, useState } from 'react';
import * as uuid from 'uuid';
import { RawPodcast, RawPodcastSubmit, RawUserActionLog } from '../../../../store/types';
import Fetch from '../../../../services/Fetch';
import { useAsync } from 'react-use';
import Constants, { Code, FILLER_TEXT, PostCastSubmitType } from '../../../../Constants';
import { Helper } from '../../../../services/Helper';
import { Toast } from '../../../../services/Toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { ReactQuillNoSSR } from '../../../../components/form/NoSSR';
import { useRouter } from 'next/router';
import HintEditor from '../../../../page.components/listen/HintEditor';
import { useRef } from 'react';
import Meta from '../../../../components/ui/Meta';
import { useNavigate, useParams } from 'react-router-dom';
import { GetServerSideProps } from "next";
// import LogEvent from 'packages/firebase/LogEvent';
import { BadgeFunctions } from '../../../../store/badge/functions';
import { CongratFunctions } from '../../../../store/congrat/functions';

const confirm = async (content: string, title: string) => {
    return await (await import('react-st-modal')).Confirm(content, title);
}

const displayTime = (input: number) => {
    if (!Number.isNaN(input)) {
        let minutes = '';
        let seconds = '';
        minutes = Math.floor(input / 60) > 9 ? Math.floor(input / 60).toString() : "0" + Math.floor(input / 60).toString();
        seconds = Math.floor(input % 60) > 9 ? Math.floor(input % 60).toString() : "0" + Math.floor(input % 60).toString();
        return minutes + ":" + seconds;
    } else {
        return "00:00";
    }
};

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike']
    ],
}
const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent'
];
const RATE_SETTINGS = [0.5, 0.7, 1, 1.2, 1.5, 1.8, 2];
const auto_save_delay = 60;

// GENERATE HINT
const getContentArray = (submit: RawPodcastSubmit) => {
    const ans= submit.podcast_hints?submit.podcast_hints.map((e, index) => {
        if (submit.draft_array[index]) {
            return submit.draft_array[index];
        }
        return FILLER_TEXT;
    }):[];
    return ans;
};

const getContent = (submit: RawPodcastSubmit, content_array: string[]) => {
    return submit.podcast_result.replace(/\s+/g, " ").split(" ").map((e, index) => {
        var hint_index = submit.podcast_hints.indexOf(index);
        if (hint_index > -1) {
            return  content_array[hint_index] ? content_array[hint_index] : FILLER_TEXT
        } 

        return e;
    }).join(" ");
};

type Metatype = {
    id?:string,
    challenge_name?:string,
    challenge_id?:number,

}

const Listen = () => {
    const {id,name} =useParams();
    const url = useRef("");
    const [on_loading_submit, setOnLoadingSubmit] = useState(false);
    const [on_loading_change_hint, setOnLoadingChangeHint] = useState(false);
    const [on_loading_test_result, setOnLoadingTestResult] = useState(false);
    const [on_loading_save_progress, setOnLoadingSaveProgress] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement>();
    const [content, setContent] = useState("");
    const [content_array, setContentArray] = useState<string[]>([]);
    const [playing, setPlaying] = useState(false);
    const [time_listen, setTimeListening] = useState(0);
    const [on_change_slide, setOnChangeSlide] = useState('');

    const [auto_saved, setAutoSaved] = useState(0);
    const [is_started, setStarted] = useState(false);
    const [play_rate, setPlayRate] = useState(1);
    const [amount_time_adjust, setAmountTimeAdjust] = useState(5);
    const [is_looping, setLooping] = useState(true);
    const [metatype, setMetatype] = useState<Metatype>();
    const [settings, setSettings] = useState(["1", "2", "3"]);

    const [podcast_submit,setPodcastSubmit]  =useState<RawPodcastSubmit>();
    const [podcast, setPodcast] = useState<RawPodcast>();

    const navigate = useNavigate();
    useEffect(()=>{
        (async()=>{
           try {
                const ids = id?.split("_");
                url.current = (ids && ids[1])?'/api/record.challenge.user/podcast.submit.': '/api/podcast.submit/';
                const res = await Fetch.postWithAccessToken<{ podcast_submit: RawPodcastSubmit, podcast: RawPodcast, metatype:Metatype, code: number }>(`${url.current}detail`, {
                    id : ids?ids[0]:"",
                    challenge_id : ids?  ids[1]:"",
                });
                console.log(res.data);
                if(res.data && res.data.code == Code.SUCCESS){
                    const podcast_submit = res.data.podcast_submit;
                    setPodcastSubmit(podcast_submit);
                    setContentArray(getContentArray(podcast_submit));
                    setContent(podcast_submit.draft);
                    setPodcast(res.data.podcast);
                    setMetatype(res.data.metatype);
                }
           } catch (error) {
               console.log(error);
               Toast.error("ERROR !");
           }        

        })();
    },[]);
    const router = useRouter();
    const mp3Ref = useRef<HTMLDivElement>(null);

    const __init = useAsync(async () => {
       if(podcast){
            var audio = new Audio(Constants.IMAGE_URL + podcast.file_path);
            setAudio(audio);
            var settings = await localStorage.getItem('listen_settings');
            if (settings) {
                setSettings(JSON.parse(settings));
            }

            var time_adjust = await localStorage.getItem('time_adjust');
            if (time_adjust) {
                setAmountTimeAdjust(parseInt(time_adjust));
            }
       }
    }, [podcast]);


    const [reset_ui, setResetUi] = useState('');
    useEffect(() => {
        if(podcast_submit){
            const cur_interval = setInterval(() => {
                if (audio && Number.isNaN(audio.duration)) {
                    setResetUi(uuid.v4());
                }
                else {
                    changeCurrentTime(podcast_submit.current_time_listen ? podcast_submit.current_time_listen : 0, false);
                    clearInterval(cur_interval);
                }
            }, 400);
    
            return () => {
                clearInterval(cur_interval);
            }
        }
    }, [audio])


    const onChangeSetting = async (e: any) => {
        // LogEvent.sendEvent("listen.change_listen_settings");
        var new_settings = [...settings];
        new_settings[parseInt(e.target.name.replace('index_', ''))] = e.target.value;
        setSettings(new_settings);
        localStorage.setItem('listen_settings', JSON.stringify(new_settings));
    };

    const onChangeAdjustTime = async (e: any) => {
        // LogEvent.sendEvent("listen.change_time_adjust");
        localStorage.setItem('time_adjust', parseInt(e.target.value).toString());
        setAmountTimeAdjust(parseInt(e.target.value));
    };

    const onSetPlayRate = (value: number) => {
        // LogEvent.sendEvent("listen.play_rate_" + value);
        if (audio) {
            audio.playbackRate = value
            setPlayRate(value);
        }
    }

    const togglePlay = (from_key: boolean = false) => {
        // if (!from_key) {
        //     LogEvent.sendEvent("listen.toggle_play_button");
        // } else {
        //     LogEvent.sendEvent("listen.toggle_play_key");
        // }

        if (audio) {
            if (!playing) {
                audio?.play();
                setPlaying(true);
            } else {
                audio?.pause();
                setPlaying(false);
            }
        }
    };

    const goPrevXSeconds = (from_key: boolean) => {
        // if (!from_key) {
        //     LogEvent.sendEvent("listen.go_prev_button");
        // } else {
        //     LogEvent.sendEvent("listen.go_prev_key");
        // }
        changeCurrentTime(Math.max(0, time_listen - amount_time_adjust));
    };


    const goNextXSeconds = (from_key: boolean = false) => {
        // if (!from_key) {
        //     LogEvent.sendEvent("listen.go_next_button");
        // } else {
        //     LogEvent.sendEvent("listen.go_next_key");
        // }

        changeCurrentTime(time_listen + amount_time_adjust);
    };

    const onChangeHandle = (e: any) => {
        // LogEvent.sendEvent("listen.change_time_using_handle");
        changeCurrentTime(e.target.value)
    };

    const changeCurrentTime = (current: number, play: boolean = true) => {
        if (audio && !Number.isNaN(audio.duration) && current >= 0 && current <= audio.duration) {
            audio.currentTime = current;

            if (play) {
                audio.play();
                setPlaying(play);
            }

            setTimeListening(current)
            setOnChangeSlide(uuid.v4())
        }
    };

    const onChangeHint = async () => {
        // LogEvent.sendEvent("listen.change_to_hint");
        
        var result = await confirm(`Change to hint , you will lose your current writing`, 'Change to hint!');
        if (!result) {
            return;
        }

        try {
            if (podcast) {
                const ids = id?.split("_");
                const res = await Fetch.postWithAccessToken<{ podcast_submit: RawPodcastSubmit, code: number ,message: string}>(`${url.current}get`, {
                    id: podcast.id,
                    metatype: 'hint',
                    challenge_id : ids ? ids[1]: "",
                });
                console.log(url.current);
                console.log(res.data);
                if (res.status == 200) {
                    if (res.data && res.data.code == Code.SUCCESS) {
                        const podcast_submit = res.data.podcast_submit;
                        setContentArray(getContentArray(podcast_submit));
                        setContent(podcast_submit.draft);
                        setPodcastSubmit(podcast_submit);
                        Toast.success("Start Listening!");
                    }else{
                        Toast.error(res.data.message);
                    }
                }
            }
        }
        catch(err) {
            console.log(err);
            Toast.error("Some errors occurred!")
        }


    };

    const onSubmit = async () => {
        // LogEvent.sendEvent("listen.submit");
        const ids = id?.split("_");
        if (!is_started) {
            await confirm(`Let's play audio file`, 'Start listening!');
            return;
        };

        const result = await confirm('Do you want to finish the listen of this podcast? You cannot undone !!!', 'Submit listening!');
        if (!result) {
            setOnLoadingSubmit(false);
            return;
        }

        if (podcast_submit && podcast) {
            setOnLoadingSubmit(true);
            try {
                let res;
                if(metatype ){
                    console.log("???");
                    res = await Fetch.postWithAccessToken<{ code: number, message: string, podcast_submit: RawPodcastSubmit }>('/api/record.challenge.user/podcast.submit.submit', {
                        id: metatype.id,
                        podcast_id: podcast.id,
                        content: podcast_submit.metatype == 'hint' ? getContent(podcast_submit, content_array) : content,
                        content_array: JSON.stringify(content_array),
                    });
                }else if(action_log.value){
                    res = await Fetch.postWithAccessToken<{ code: number, message: string, podcast_submit: RawPodcastSubmit }>('/api/podcast.submit/submit', {
                        id: podcast_submit.id,
                        content: podcast_submit.metatype == 'hint' ? getContent(podcast_submit, content_array) : content,
                        content_array: JSON.stringify(content_array),
                        action_log_id: action_log.value.user_action_log.id
                    });
    
                    // end action log
                    // if (!action_log.value) {
                    //     console.log("End action log error: action haven't started yet");
                    //     return;
                    // }
                }
                console.log(res);
                setOnLoadingSubmit(false)
                if (res && res.status == 200) {
                    if (res.data && res.data.code == Code.SUCCESS) {
                        CongratFunctions.load('Bạn đã nộp bài thành công');
                        BadgeFunctions.onSubmitted();
                        const {origin} = window.location;
                        setTimeout(() => {
                            navigate(`/podcasts/listen/${Helper.generateCode(podcast.name)}/${podcast.id}_${ids&&ids[1]?ids[1]:""}/result`);
                        }, 1000);

                        return;
                    }
                    console.log(res.data);
                    Toast.error(res.data.message);
                    return
                }
            } catch (err) {
                console.log('error', err)
            }
        }

        setOnLoadingSubmit(false)
        Toast.error("Some errors occurred");
        return;
    }

    const onSaveProgress = async () => {
        // LogEvent.sendEvent("listen.save_progress");
        if (!is_started) {
            await confirm(`Let's play audio file`, 'Start listening!');
            return;
        }

        setOnLoadingSaveProgress(true)
       if(podcast_submit && podcast){
        try {
            let res;
            if(metatype){
                res = await Fetch.postWithAccessToken<{ code: number, message: string }>('/api/record.challenge.user/podcast.submit.update', {
                    id: metatype.id,
                    podcast_id: podcast.id,
                    current_time_listen: time_listen,
                    draft: content,
                    content_array: JSON.stringify(content_array),
                });
            }else{
                res = await Fetch.postWithAccessToken<{ code: number, message: string }>('/api/podcast.submit/update', {
                    id: podcast_submit.id,
                    current_time_listen: time_listen,
                    draft: content,
                    content_array: JSON.stringify(content_array),
                });
    
                // update action log
                if (!action_log.value) {
                    console.log("End action log error: action haven't started yet");
                    return;
                }
                Fetch.postWithAccessToken('/api/user.action.log/update', {
                    id: action_log.value.user_action_log.id,
                    podcast_id: podcast.id,
                });
            }

            setOnLoadingSaveProgress(false)
            if (res && res.status == 200) {
                if (res.data && res.data.code == Code.SUCCESS) {
                    Toast.success("Saved Process!");
                    return;
                }
                Toast.error(res.data.message);
                return
            }
        } catch {

        }

       }
        setOnLoadingSaveProgress(false)
        Toast.error("Some errors occurred");
    }

    const onTestResult = async () => {
        // LogEvent.sendEvent("listen.test_result");
       if(podcast_submit){
        setOnLoadingTestResult(true);
        var result = await Fetch.postWithAccessToken<{ percent: number }>('/api/podcast.submit/compare', {
            result_text: podcast_submit.podcast_result,
            user_text: podcast_submit.metatype == 'hint' ? getContent(podcast_submit, content_array) : content,
        });
        setOnLoadingTestResult(false);
        console.log(result.data);
        await confirm(`Your result is ${(Number(result.data.percent) * 100).toFixed(2)}% now`, 'Start listening!');
       }
    };

    useEffect(() => {
        let current_time = time_listen;

        const interval_time = 1000 / (Math.floor(play_rate * 10) / 10);
        const interval = setInterval(() => {
            if (playing) {
                if (audio && !!audio.duration) {
                    if (current_time < audio.duration) {
                        current_time = parseInt(current_time.toString()) + 1;
                        setTimeListening(current_time)
                    } else {
                        if (is_looping) {
                            changeCurrentTime(0);
                        }
                        else {
                            clearInterval(interval);
                            setPlaying(false);
                        }
                    }
                }
            }
        }, interval_time);

        return () => {
            clearInterval(interval);
        };
    }, [playing, on_change_slide, play_rate, is_looping])

    useEffect(() => {
        var $fill = $(".bar .fill");
        if (audio && audio.duration) {
            $fill.css("width", (time_listen / audio.duration * 100) + "%");
        }
    }, [time_listen]);

    useEffect(() => {
        $('.js-text-writing').on('keydown', (e) => {
            if (settings.includes(e.key)) {
                e.preventDefault();
            }
            if (e.key == settings[0]) {
                togglePlay(true);
            } else if (e.key == settings[1]) {
                goPrevXSeconds(true);
            } else if (e.key == settings[2]) {
                goNextXSeconds(true);
            }
        })
        return () => {
            $('.js-text-writing').off('keydown')
        }
    }, [audio, playing, play_rate, time_listen, settings])

    useEffect(() => {
        return () => {
            audio?.pause();
        }
    }, [audio])

    useEffect(() => {
        if (playing) setStarted(true);
    }, [playing])

    useEffect(() => {
        let counter = auto_saved;
        const interval = setInterval(() => {
            console.log("a minute passed");
            counter++;
            setAutoSaved(counter)
            return;
        }, auto_save_delay * 1000);
        return () => {
            clearInterval(interval);
        }
    }, [])

    useEffect(() => {
        if (content == "") return;
        if (!is_started) return;
        if(podcast_submit&&podcast){
            // console.log(content_array);
            try {
                if(metatype){
                   console.log(getContent(podcast_submit, content_array));
                    Fetch.postWithAccessToken<{ code: number, message: string }>('/api/record.challenge.user/podcast.submit.update', {
                        id: metatype.id,
                        podcast_id: podcast.id,
                        current_time_listen: time_listen,
                        content_array: JSON.stringify(content_array),
                        draft: podcast_submit.metatype == 'hint' ? getContent(podcast_submit, content_array) : content,
                        
                    });
               }else{
                    // update action log
                    if (!action_log.value) {
                        console.log("Update action log error: action haven't started yet");
                        return;
                    }
        
                    Fetch.postWithAccessToken('/api/user.action.log/update', {
                        id: action_log.value.user_action_log.id,
                        podcast_id: podcast.id,
                    });
               }
            }
            catch {
    
            }
        }
        return;
    }, [auto_saved])

    const action_log = useAsync(async () => {
        if (is_started&&podcast&&!metatype) {
            const res = await Fetch.postWithAccessToken<{ user_action_log: RawUserActionLog, code: number }>('/api/user.action.log/get-or-create', {
                id: -1,
                podcast_id: podcast.id
            });

            if (res.status == 200) {
                if (res.data && res.data.code === Code.SUCCESS) {
                    return {
                        user_action_log: res.data.user_action_log,
                    }
                }
            }
            return null;
        }
    }, [is_started]);


    return (
        <>
        {podcast&&podcast_submit?(
            <>
            <Meta url={`${Constants.DOMAIN}/podcasts/detail/${Helper.generateCode(podcast.name + "_" + podcast.sub_name)}/${podcast.id}`}
                description={podcast.description.slice(0, 200)}
                title={`${podcast.name} ${podcast.sub_name}`}
                image={`${Constants.IMAGE_URL + podcast.image_url}`}
            />
            <div className="w-full pt-16">
                <Breadcrumb podcast={podcast} />
                <div className="flex flex-col-reverse semi-md:flex-row w-full pb-32 pl-5 sm:pl-10 pr-5 2xl:pr-20 sm:pr-10">
                    <div className="semi-md:pb-0  pb-24 semi-md:w-8/12  w-full semi-md:pr-10" style={{ minHeight: 1200 }}>
                        <div className="w-full js-text-writing">
                            {
                                podcast_submit.metatype == 'hint' ?
                                    <HintEditor content_array={content_array} setContentArray={setContentArray} submit={podcast_submit} /> :
                                    <ReactQuillNoSSR theme="snow"
                                        modules={modules}
                                        formats={formats}
                                        className=" w-full"
                                        value={content} onChange={setContent}
                                    />
                            }
                        </div>
                        <div className="flex mt-20 justify-center">
                            {
                                podcast_submit.status == PostCastSubmitType.DOING && (<a
                                    onClick={onSubmit}
                                    className=" flex items-center justify-center cursor-pointer mr-5 text-sm font-medium bg-green-700 w-24 text-white py-1.5 rounded-full hover:bg-primary-dark transition-all">
                                    {on_loading_submit && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                                    <span>SUBMIT</span>
                                </a>)
                            }
                            {
                                (podcast_submit.status == PostCastSubmitType.DOING && podcast_submit.metatype != 'hint') && (<a
                                    onClick={onChangeHint}
                                    className=" flex items-center justify-center cursor-pointer mr-5 text-sm font-medium bg-primary w-36 text-white py-1.5 rounded-full hover:bg-primary-dark transition-all">
                                    {on_loading_change_hint && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                                    <span>CHANGE TO HINT</span>
                                </a>)
                            }
                            <a
                                onClick={onTestResult}
                                className=" cursor-pointer flex items-center justify-center mr-5 text-sm font-medium bg-primary w-40 text-white py-1.5 rounded-full hover:bg-primary-dark transition-all">
                                {on_loading_test_result && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                                <span>TEST RESULT</span>
                            </a>
                            <a
                                onClick={onSaveProgress}
                                className=" cursor-pointer flex items-center justify-center  text-sm font-medium bg-primary w-40 text-white py-1.5 rounded-full hover:bg-primary-dark transition-all">
                                {on_loading_save_progress && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                                <span>SAVE PROGRESS</span>
                            </a>
                        </div>
                    </div>
                    <div className={`cursor-pointer semi-md:w-4/12 w-full mb-20 relative`} >
                        <div className={`w-full mt-3 sm:mt-0 h-full overflow-auto`}>
                            <h5 className="text-base font-semibold text-primary mb-2">{podcast.name}</h5>
                            <h3 className=" text-lg  leading-6">ESL {podcast.sub_name}</h3>
                            <div className=" mt-6 flex w-full justify-between">
                                <div className="flex flex-row items-center mb-2 sm:mb-0 text-xs">
                                    <span className="text-sm mr-1 text-gray-900"><FaHeadphonesAlt /></span>
                                    <span className=" font-light">{podcast.views}</span>
                                </div>
                                <div className="flex lg:flex-row flex-col items-center mb-2 sm:mb-0 text-xs">
                                    <span className="text-sm mr-1 text-gray-900"><FiBookmark /></span>
                                    <span className=" font-light mt-1 lg:mt-0"></span>
                                </div>
                            </div>

                            <div
                                className="flex w-full mt-5 semi-md:rounded-lg overflow-hidden bg-white bg-cover bg-center shadow-md bottom-0 z-2 fixed">
                                <div className=" bg-gray-100 semi-md:bg-white pt-2 pb-2 px-4 w-full semi-md:w-auto" ref={mp3Ref}>

                                    {audio && (<>
                                        <div className="flex justify-center items-center">
                                            <span
                                                onClick={() => setLooping(!is_looping)}
                                                className={`cursor-pointer text-xl mr-5 ${is_looping ? "text-primary-dark" : "text-gray-500"} hover:text-gray-900 transition-all`}>
                                                <IoRepeat />
                                            </span>
                                            <span
                                                onClick={() => goPrevXSeconds(true)}
                                                className="cursor-pointer  text-xl shadow-md mr-5 text-white px-1 py-1 bg-primary hover:bg-primary-dark transition-all rounded-full">
                                                <FaChevronLeft />
                                            </span>
                                            <span onClick={() => togglePlay()} className="cursor-pointer bg--  text-2xl shadow-md text-white px-2 py-2 bg-primary hover:bg-primary-dark transition-all rounded-full">
                                                {playing ? <IoPause /> : <FaPlay />}
                                            </span>
                                            <span
                                                onClick={() => goNextXSeconds()}
                                                className="cursor-pointer  text-xl shadow-md ml-5 text-white px-1 py-1 bg-primary hover:bg-primary-dark transition-all rounded-full">
                                                <FaChevronRight />
                                            </span>
                                            <select className=" cursor-pointer outline-none focus:outline-none text-lg ml-5 text-gray-500 hover:text-gray-900 transition-all" onChange={(e) => onSetPlayRate(parseFloat(e.target.value.toString()))}>
                                                {RATE_SETTINGS.map((value, index) => (
                                                    <option key={index} value={value} selected={Math.floor(play_rate * 10) / 10 == value}> x{value}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex justify-between px-4">
                                            <p className="text-sm">{displayTime(time_listen)}</p>
                                            <p className="text-sm">{displayTime(audio.duration)}</p>
                                        </div>
                                        <div className="px-4">
                                            <div className="relative slider-container">
                                                <span className="bar cursor-pointer shadow absolute left-0 top-3 w-full h-2 rounded-full overflow-hidden bg-primary bg-opacity-30">
                                                    <span className="fill block w-0 h-full bg-primary"></span>
                                                </span>
                                                <input id="slider" type="range" min={0} max={Number.isNaN(audio.duration) ? 1 : audio.duration} value={time_listen} onChange={onChangeHandle}
                                                    className="slider cursor-pointer relative appearance-none w-full h-1 rounded-full outline-none bg-transparent" />
                                            </div>
                                        </div>
                                    </>)}
                                </div>
                                <img className="semi-md:block max-h-16 object-contain none" src={Constants.IMAGE_URL + podcast.image_url} alt="" />
                            </div>

                            <div className="w-full mt-5 none  semi-md:block">
                                <h5 className="mb-1 font-semibold ">Shortcut:</h5>
                                <p className="text-gray-400 mb-1">Please enter key your want to use to control player</p>
                                <p className="text-gray-400 mb-1">Dùng phím gõ những phím tắt bạn muốn để điều khiển mp3</p>
                                <div className="flex items-start">
                                    <div className="flex flex-col">
                                        <div className="mb-2">
                                            <label htmlFor="adjust-time" className="block bg-gray-400 text-white text-center font-medium px-3 py-1 rounded cursor-pointer">adjust</label>
                                        </div>
                                        {/* <List
                                            values={settings}
                                            onChange={({ oldIndex, newIndex, }) => {
                                                setSettings(arrayMove(settings, oldIndex, newIndex))
                                            }}
                                            renderList={({ children, props }) => <div {...props} className="">
                                                {children}
                                            </div>}
                                            renderItem={({ value, props, isDragged, isSelected, index }) => (
                                                <div style={{
                                                    ...props.style,
                                                    // zIndex: isDragged || isSelected ? 5000 : props.style?.zIndex
                                                }} {...props} key={value} className="mb-2">
                                                    <div className={`bg-gray-200 px-3 py-1 font-medium text-center rounded shadow cursor-pointer`}>
                                                        <input name={`index_${index}`} type="text" maxLength={1} className="text-center outline-none focus:outline-none w-10" value={settings[index ? index : 0]} onChange={onChangeSetting} />
                                                    </div>
                                                </div>
                                            )} /> */}
                                    </div>
                                    <div className="flex-1 ml-3">
                                        <div className="mb-2">
                                            <div className="bg-gray-100 text-gray-500 px-3 py-1 justify-center rounded text-center flex items-center">
                                                <input className=" flex-1 bg-gray-100 text-gray-500 px-3 rounded text-center cursor-pointer outline-none focus:outline-none" type="number" onChange={onChangeAdjustTime} name="" value={amount_time_adjust} id="adjust-time" />
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-center">Toggle Play </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-center">Go prev </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-center">Go next </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>):""}
        </>
    )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const res = await Fetch.postJson<{ podcast_submit: RawPodcastSubmit, podcast: RawPodcast, code: number }>('/api/podcast.submit/detail', {
//         id: (context.params) ? (context.params)['id'] : 0,
//         access_token: Helper.getCookieFromReq("access_token", context.req.headers.cookie ? context.req.headers.cookie.toString() : "")
//     });
//     console.log(res);
//     return {
//         props: {
//             podcast_submit: res.data.podcast_submit,
//             podcast: res.data.podcast
//         }
//     };
// }
export default Listen;