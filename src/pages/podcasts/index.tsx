import { FaChevronRight, FaHeadphonesAlt, FaChevronLeft } from 'react-icons/fa'
import { Helper } from '../../services/Helper';

import Sidebar from '../../components/sidebar/Sidebar';
import { BsFilter } from 'react-icons/bs'
import React, { useMemo, useState } from 'react';

import { useAsync } from 'react-use';
import Fetch from '../../services/Fetch';
import Constants, { Code, FILLER_TEXT, PostCastSubmitType } from '../../Constants';
import { RawPodcast, RawPodcastCollection, RawPodcastSubmit } from '../../store/types';


import Paginate from '../../components/paginate/Paginate';

// import Link from 'next/link';
import Meta from '../../components/ui/Meta';
import { MeHook } from '../../store/me/hooks';
import FilterTag from '../../page.components/podcasts/FilterTag';
import HomeFooter from '../../components/footer/HomeFooter';
import { Link, useParams } from 'react-router-dom';

type ResponseType = {
    podcasts: RawPodcast[],
    podcast_num: number,
    code: number,
    podcast_submits: RawPodcastSubmit[]
}

const ListPodcasts = () => {
    const page_size = 12;
    const [reload, setReload] = useState('');
    const [openSidebar, setOpenSidebar] = useState(true);

    const { page } = useParams();

    const me = MeHook.useMe();

    const state = useAsync(async () => {
        console.log(Helper.getURLParams());
        const res = await Fetch.postWithAccessToken<ResponseType>('/api/podcasts/list', {
            ...Helper.getURLParams(),
            page_size: page_size
        });

        if (res.status == 200) {
            if (res.data && res.data.code == Code.SUCCESS) {
                return {
                    podcasts: res.data.podcasts,
                    podcast_num: res.data.podcast_num,
                    podcast_submits: res.data.podcast_submits
                }
            }
        }

        return {
            podcasts: [],
            podcast_num: 0,
            podcast_submits: []
        }
    }, [Helper.setAndGetURLParam([]), reload, me]);

    return (
        <>
            <Meta />
            <div className="flex w-full items-stretch">
                <Sidebar openSidebar={openSidebar} setOpenSidebar={(value) => setOpenSidebar(value)} />
                <div className="pt-16 pb-32 pl-5 sm:pl-10 pr-5 2xl:pr-20 sm:pr-10 xl:w-10/12 semi-md:w-4/5 w-full">
                    <div className="semi-md:none">
                        <div className="flex items-center" >
                            <span className="cursor-pointer text-xl pr-2 text-primary" onClick={() => setOpenSidebar(true)}><BsFilter /></span>
                            <span className="cursor-pointer text-xs font-semibold" onClick={() => setOpenSidebar(true)}>Filters</span>
                        </div>
                    </div>
                    <div className="list">
                        <div className="w-full mt-3">
                            <FilterTag />
                            <div className="w-full flex flex-wrap items-stretch mt-10">
                                {
                                    (state.loading) ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) => (
                                        <Replacement key={e} />
                                    )) : ((state.value?.podcasts as RawPodcast[]).length > 0 ? (state.value?.podcasts as RawPodcast[]).map((podcast, index) => {
                                        return (<PodcastItem key={podcast.id} podcast={podcast} podcast_submits={state.value?.podcast_submits} />
                                        )
                                    }) : (<>
                                        <div className="w-full px-5 py-5 text-center rounded-lg shadow">
                                            <h5>No Results Found</h5>
                                        </div>
                                    </>))
                                }
                            </div>

                            {state.value && state.value.podcast_num > page_size &&
                                //@ts-ignore
                                <div className="w-full flex justify-center mt-7 md:mt-14"><Paginate num_items={state.value.podcast_num} page_size={page_size} current_page={page ? parseInt(page) : undefined} /> </div>}

                        </div>
                    </div>

                </div>
            </div>

            <div className="flex">
                <div className="xl:w-2/12 semi-md:w-1/5 w-0"></div>
                <div className="xl:w-10/12 semi-md:w-4/5 w-full">
                    <div
                        style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,.1), rgba(255,255,255,.1)), url('/static/footer.jpg')` }}
                        className="flex bg-center bg-cover">
                        <HomeFooter />
                    </div>
                </div>
            </div>



        </>
    )
}


interface PodcastItemProps {
    podcast: RawPodcast,
    collections?: RawPodcastCollection[],
    podcast_submits?: RawPodcastSubmit[]
}

const PodcastItem = ({ podcast, podcast_submits }: PodcastItemProps) => {
    var podcast_submit = useMemo(() => {
        var submits = podcast_submits ? podcast_submits : [];
        return submits.find(e => e.podcast_id == podcast.id);
    }, [podcast, podcast_submits]);

    var percent_complete = useMemo(() => {
        if (podcast_submit) {
            var submit_words_num = podcast_submit.draft.replaceAll(FILLER_TEXT, "").replace(/\s+/g, " ").split(" ").length;
            var content_words_num = (podcast_submit.content ? podcast_submit.content : '').replaceAll(FILLER_TEXT, "").replace(/\s+/g, " ").split(" ").length;
            submit_words_num = submit_words_num > content_words_num ? submit_words_num : content_words_num;
            var words_num = podcast.result.replace(/\s+/g, " ").split(" ").length;

            if (podcast_submit.metatype == 'hint') {
                return Math.min(100, 100 * (submit_words_num - podcast.hint.length) / (words_num - podcast.hint.length));
            }

            return Math.min(100, 100 * (submit_words_num) / (words_num));
        }

        return 0;
    }, [podcast_submit, podcast]);

    return (
        <div className="w-full md:w-1/2 semi-lg:w-1/3 mb-10 md:mb-7">
            <Link to={`/podcasts/detail/${Helper.generateCode(podcast.name)}_${Helper.generateCode(podcast.sub_name)}/${podcast.id}`} >
                <a className="w-full h-full semi-xs:w-5/6 sm:w-3/4 md:w-11/12 2xl:w-10/12 mx-auto flex flex-col box-border px-3  pt-3 pb-4 shadow-md hover:shadow-xl rounded-lg transition-all">
                    <div className="flex items-center md:items-stretch">
                        <div
                            style={{
                                backgroundImage: `url(${Constants.IMAGE_URL + podcast.image_url})`
                            }}
                            className="bg-center flex-shrink-0 bg-cover bg-no-repeat w-1/2 h-24 sm:h-28 md:h-20 2xl:h-24 rounded-lg">

                        </div>
                        <div className="pl-3 md:pl-2 flex-1 flex flex-col justify-between">
                            <div className="">
                                <h4 className="mb-0.5 mt-0 text-base font-bold text-primary">ESL {podcast.sub_name}</h4>
                                <p className="text-base text-gray-900 line-clamp-2 leading-5 font-semibold">
                                    {podcast.name}
                                </p>
                                {podcast_submit && (<div className="relative pt-1">
                                    <div className={`overflow-hidden h-2 mb-1 text-xs flex rounded ${podcast_submit.status == PostCastSubmitType.SUBMITTED ? 'bg-red-700' : 'bg-gray-200'}`}>
                                        <div style={{ width: `${percent_complete}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                    </div>
                                </div>)}
                            </div>

                            <div className="flex w-full mt-2">


                                <div className="flex items-center text-xs mr-2">
                                    <span className="text-sm mr-1"><FaHeadphonesAlt /></span>
                                    <span className=" font-light">{podcast.views ? podcast.views : 0}</span>
                                </div>
                                {/* <div className="flex items-center text-xs">
                            <span className="text-sm mr-1 text-primary"><IoTime /></span>
                            <span className=" font-light"></span>
                        </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-500 font-light line-clamp-2">
                            {Helper.extractContentByRegex(podcast.description)}
                        </p>
                    </div>
                    {/* <div className="flex justify-between mt-2">
                <div></div>
                <a to="#" className=" text-primary flex items-center hover:text-primary-dark transition-all">
                    <span className=" text-sm mr-2">Add to favorites</span>
                    <span className=" text-base"><FiHeart /></span>
                </a>
            </div> */}
                </a>
            </Link>
        </div>);
};

const Replacement = () => {
    return (
        <div className="w-full md:w-1/2 semi-lg:w-1/3 mb-10 md:mb-7">
            <a className="w-full animate-pulse semi-xs:w-5/6 sm:w-3/4 md:w-11/12 2xl:w-10/12 mx-auto flex flex-col box-border px-3  pt-3 pb-4 shadow-md hover:shadow-xl rounded-lg transition-all">
                <div className="flex items-center md:items-stretch">
                    <div
                        className="flex-shrink-0 bg-gray-200 w-24 h-24 sm:w-28 sm:h-28 md:w-20  md:h-20 2xl:w-24 2xl:h-24 rounded-lg">
                    </div>
                    <div className="pl-3 flex-1 md:pl-2 flex flex-col">
                        <div className="w-full">
                            <div className="h-5 w-4/5  rounded bg-gray-200 ">

                            </div>
                        </div>

                        <div className="flex h-4 rounded-lg bg-gray-200 mt-2 h">
                        </div>
                        <div className="flex h-4 rounded-lg bg-gray-200 mt-2 h">
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
};

export default ListPodcasts;