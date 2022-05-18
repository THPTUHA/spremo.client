import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import { IoMdPause, IoMdRepeat } from "react-icons/io";
import { useAsync } from "react-use";
import * as uuid from 'uuid';
import $ from 'jquery';

const RATE_SETTINGS = [5, 7, 10, 12, 15, 18, 20];
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


const AudioPlay = ({url,id}:{url: string,id: any})=>{
    const [audio, setAudio] = useState<HTMLAudioElement>();
    const [is_looping, setLooping] = useState(true);
    const [time_listen, setTimeListening] = useState(0);
    const [amount_time_adjust, setAmountTimeAdjust] = useState(5);
    const [playing, setPlaying] = useState(false);
    const [on_change_slide, setOnChangeSlide] = useState('');
    const [play_rate, setPlayRate] = useState(10);

    const [settings, setSettings] = useState(["1", "2", "3"]);

    const [reset_ui, setResetUi] = useState('');
    const mp3Ref = useRef<HTMLDivElement>(null);

    const getDuration = ()=>{
        if(audio){
            audio.currentTime = 0;
            audio.removeEventListener('timeupdate',getDuration);
        }
    }
    const __init = useAsync(async () => {
        var audio = await new Audio(url);
        audio.addEventListener('loadedmetadata',function(){
            if(audio.duration == Infinity){
                audio.currentTime = 1e101;
                audio.addEventListener('timeupdate',getDuration)
            }
        })
        setAudio(audio);
        var settings = await localStorage.getItem('listen_settings');
        if (settings) {
            setSettings(JSON.parse(settings));
        }

        var time_adjust = await localStorage.getItem('time_adjust');
        if (time_adjust) {
            setAmountTimeAdjust(parseInt(time_adjust));
        }
    }, []);

    
    useEffect(() => {
        const cur_interval = setInterval(() => {
            if (audio && Number.isNaN(audio.duration)) {
                setResetUi(uuid.v4());
            }
        }, 400);

        return () => {
            clearInterval(cur_interval);
        }
    }, [audio])

    
    useEffect(() => {
        var $fill = $(`.bar .id${id}`);
        if (audio && audio.duration) {
            $fill.css("width", (time_listen / Math.floor(audio.duration) * 100) + "%");
        }
    }, [time_listen]);

    const goPrevXSeconds = (from_key: boolean) => {
        changeCurrentTime(Math.max(0, time_listen - amount_time_adjust));
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

    useEffect(() => {
        let current_time = time_listen;

        const interval_time = 1000 / (play_rate / 10);
        const interval = setInterval(() => {
            if (playing) {
                if (audio && !!audio.duration) {
                    if (current_time < Math.floor(audio.duration)) {
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
    
    const togglePlay = (from_key: boolean = false) => {
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

    const goNextXSeconds = (from_key: boolean = false) => {
        changeCurrentTime(time_listen + amount_time_adjust);
    };

    const onChangeHandle = (e: any) => {
        changeCurrentTime(e.target.value)
    };

    const onSetPlayRate = (value: number) => {
        if (audio) {
            audio.playbackRate = value
            setPlayRate(value);
        }
    }

    return (
        <div ref={mp3Ref}>
            {
                audio &&(
                     <>
                        <div className="flex justify-center items-center">
                            <span
                                onClick={() => setLooping(!is_looping)}
                                className={`cursor-pointer text-xl mr-5 ${is_looping ? "text-primary-dark" : "text-gray-500"} hover:text-gray-900 transition-all`}>
                                <IoMdRepeat />
                            </span>
                            <span
                                onClick={() => goPrevXSeconds(true)}
                                className="cursor-pointer  text-xl shadow-md mr-5 text-white px-1 py-1 bg-primary hover:bg-primary-dark transition-all rounded-full">
                                <FaChevronLeft />
                            </span>
                            <span onClick={() => togglePlay()} className="cursor-pointer bg--  text-2xl shadow-md text-white px-2 py-2 bg-primary hover:bg-primary-dark transition-all rounded-full">
                                {playing ? <IoMdPause /> : <FaPlay />}
                            </span>
                            <span
                                onClick={() => goNextXSeconds()}
                                className="cursor-pointer  text-xl shadow-md ml-5 text-white px-1 py-1 bg-primary hover:bg-primary-dark transition-all rounded-full">
                                <FaChevronRight />
                            </span>
                            <select className=" cursor-pointer outline-none focus:outline-none text-lg ml-5 text-gray-500 hover:text-gray-900 transition-all" 
                                defaultValue={play_rate}
                                onChange={(e) => onSetPlayRate(parseInt(e.target.value.toString()))}>
                                {RATE_SETTINGS.map((value, index) => (
                                    <option key={index} value={value}> x{(value/10).toFixed(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-between px-4">
                            <p className="text-sm">{displayTime(time_listen)}</p>
                            <p className="text-sm">{displayTime(Math.floor(audio.duration))}</p>
                        </div>
                        <div className="px-4">
                            <div className="relative slider-container">
                                <span className="bar cursor-pointer shadow absolute left-0 top-3 w-full h-2 rounded-full overflow-hidden bg-primary bg-opacity-30">
                                    <span className={`fill block w-0 h-full bg-primary id${id}`}></span>
                                </span>
                                <input id="slider" type="range" min={0} max={Number.isNaN(audio.duration) ? 1 : Math.floor(audio.duration)} value={time_listen} onChange={onChangeHandle}
                                    className="slider cursor-pointer relative appearance-none w-full h-1 rounded-full outline-none bg-primary" />
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default AudioPlay;