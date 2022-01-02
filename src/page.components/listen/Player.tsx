import Constants from '../../Constants';
import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa';
import { IoPause, IoRepeat } from 'react-icons/io5';
import { RawPodcast } from '../../store/types';
import * as uuid from 'uuid';
import $ from 'jquery';

const play_rate_settings = [0.5, 0.7, 1, 1.2, 1.5, 1.8, 2];
const displayTime = (input: number) => {
    if (!Number.isNaN(input)) {
        let minutes = '';
        let seconds = '';
        minutes = Math.floor(input / 60) > 9 ? Math.floor(input / 60).toString() : "0" + Math.floor(input / 60).toString();
        seconds = Math.floor(input % 60) > 9 ? Math.floor(input % 60).toString() : "0" + Math.floor(input % 60).toString();
        return minutes + ":" + seconds;
    }
    else {
        return "00:00";
    }
};

interface Props {
    podcast: RawPodcast
}


const _Player = ({ podcast }: Props) => {

    const [audio, setAudio] = useState<HTMLAudioElement>();
    const [playing, setPlaying] = useState(false);
    const [time_listen, setTimeListening] = useState(0);
    const [on_change_slide, setOnChangeSlide] = useState('');

    const [play_rate, setPlayRate] = useState(1);
    const [amount_time_adjust, setAmountTimeAdjust] = useState(5);
    const [is_looping, setLooping] = useState(true);


    useEffect(() => {
        var audio = new Audio(Constants.IMAGE_URL + podcast.file_path);
        setAudio(audio);

        return () => {
            audio?.pause();
        }
    }, []);

    const togglePlay = () => {
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

    const goPrevXSeconds = () => {
        changeCurrentTime(time_listen - amount_time_adjust);
    };

    const onSetPlayRate = (value: number) => {
        if (audio) {
            audio.playbackRate = value
            setPlayRate(value);
        }
    }

    const goNextXSeconds = () => {
        changeCurrentTime(time_listen + amount_time_adjust);
    };

    const onChangeHandle = (e: any) => {
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

    useEffect(() => {
        let current_time = time_listen;



        const interval = setInterval(() => {
            if (playing) {
                if (audio && !!audio.duration) {
                    if (current_time < audio.duration) {
                        current_time = parseInt(current_time.toString()) + 1;
                        setTimeListening(current_time)
                    }
                    else {
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
        }, 1000 / (Math.floor(play_rate * 10) / 10))
        return () => {
            clearInterval(interval);

        }
    }, [playing, on_change_slide, play_rate, is_looping])

    useEffect(() => {
        var $fill = $(".bar .fill");
        if (audio && audio.duration) {
            $fill.css("width", (time_listen / audio.duration * 100) + "%");
        }
    }, [time_listen]);
    return (
        <div
            className="">
            <div className=" bg-gray-100 semi-md:bg-white pt-2 pb-3 px-4 semi-md:px-9">

                {audio && (<>
                    <div className="">
                        <div className="relative slider-container ">
                            <span className="bar cursor-pointer shadow absolute left-0 top-3 w-full h-2 rounded-full overflow-hidden bg-primary bg-opacity-30">
                                <span className="fill block w-0 h-full bg-primary"></span>
                            </span>
                            <input id="slider" type="range" min={0} max={Number.isNaN(audio.duration) ? 1 : audio.duration} value={time_listen} onChange={onChangeHandle}
                                className="slider cursor-pointer relative appearance-none w-full h-1 rounded-full outline-none bg-transparent" />
                        </div>
                    </div>

                    <div className="flex justify-between mt-1">
                        <p className="text-sm">{displayTime(time_listen)}</p>
                        <p className="text-sm">{displayTime(audio.duration)}</p>
                    </div>

                    <div className="flex justify-center items-center">
                        <span
                            onClick={() => setLooping(!is_looping)}
                            className={`cursor-pointer text-xl mr-5 ${is_looping ? "text-primary-dark" : "text-gray-500"} hover:text-gray-900 transition-all`}>
                            <IoRepeat />
                        </span>
                        <span
                            onClick={() => goPrevXSeconds()}
                            className="cursor-pointer  text-xl shadow-md mr-5 text-white px-1 py-1 bg-primary hover:bg-primary-dark transition-all rounded-full">
                            <FaChevronLeft />
                        </span>
                        <span onClick={togglePlay} className="cursor-pointer bg--  text-2xl shadow-md text-white px-2 py-2 bg-primary hover:bg-primary-dark transition-all rounded-full">
                            {playing ? <IoPause /> : <FaPlay />}
                        </span>
                        <span
                            onClick={() => goNextXSeconds()}
                            className="cursor-pointer  text-xl shadow-md ml-5 text-white px-1 py-1 bg-primary hover:bg-primary-dark transition-all rounded-full">
                            <FaChevronRight />
                        </span>
                        <select className=" cursor-pointer outline-none focus:outline-none text-lg ml-5 text-gray-500 hover:text-gray-900 transition-all" onChange={(e) => onSetPlayRate(parseFloat(e.target.value.toString()))}>
                            {play_rate_settings.map((value, index) => (
                                <option key={index} value={value} selected={Math.floor(play_rate * 10) / 10 == value}> x{value}</option>
                            ))}
                        </select>
                    </div>
                </>)}
            </div>

        </div>
    )
};

export default _Player;

