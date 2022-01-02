import  { useEffect, useState } from "react";
import { FaPlus, FaRegImage } from 'react-icons/fa';
import Constants, { Code, LAYOUT_TYPES, MediaQuery, PodcastSource } from "../../../Constants";
import { useMediaQuery } from "react-responsive";
import { RawPodcast } from "../../../store/types";
import Fetch from "../../../services/Fetch";
import { FiFilter } from "react-icons/fi";
import { useAsync } from 'react-use';

import Paginate from '../../../components/paginate/Paginate';

import ListFilter from './_ListFilter';
import { Helper } from "../../../services/Helper";
import { HiDotsVertical } from "react-icons/hi";
import { AiFillEdit } from "react-icons/ai";
import { IoMdTrash } from "react-icons/io";
import OutsideClickDetect from "../../../components/ui/OutsideClickDetection";

import Modal from 'react-responsive-modal';
import { Toast } from "../../../services/Toast";
// import Link from "next/link";
import { Link, useLocation, useParams } from 'react-router-dom';
import * as uuid from 'uuid';

import { getHintText } from "../../../utils/hint/hint";

//@ts-ignore
import ReactHtmlParser from 'react-html-parser'
import Meta from "../../../components/ui/Meta";

type ResponseType = {
    podcasts: RawPodcast[],
    podcast_num: number,
    code: number
}

const SmallMenu = ({ podcast, reload }: { podcast: RawPodcast, reload: () => void }) => {
    const [open, setOpen] = useState(false);
    const onClickDelete = async () => {
        let result = await window.confirm("Are you sure to delete podcast " + podcast.name + "?");
        if (result) {
            try {
                const res: any = await Fetch.postWithAccessToken<{ podcast: RawPodcast, code: number }>("/api/podcasts/remove", {
                    id: podcast.id
                })

                if (res && res.data) {
                    if (res.data.code != Code.SUCCESS) {
                        Toast.error(res.data.message)
                        return;
                    }
                    else {
                        Toast.success("Remove Podcast Successful!")
                        reload();
                        return;
                    }
                }
            }
            catch {

            }
            Toast.error("Some errors occurred!")
        }
    }

    return (<>
        <OutsideClickDetect outsideFunc={() => setOpen(false)}>
            <div className="flex relative flex-col justify-end items-end">

                <span
                    onClick={(e) => { e.preventDefault(); setOpen(!open) }}
                    className=" cursor-pointer px-1.5 py-1.5 mb-2 bg-white shadow-md text-lg rounded-full transition-all hover:bg-gray-200">
                    <HiDotsVertical />
                </span>

                {open && <div className="top-full right-0 absolute ">
                    <div className="px-2 py-1 rounded-md shadow bg-white text-gray-600">
                        <Link to={`/admin/podcasts/edit/${podcast.id}`}>
                            <a className=" flex items-center outline-none focus:outline-none  mb-1 hover:text-primary-dark transition-all">
                                <span className="mr-1"><AiFillEdit /></span>
                                <span>Edit</span>
                            </a>

                        </Link>
                        <a onClick={(e) => { e.preventDefault(); onClickDelete() }} className="cursor-pointer flex items-center outline-none focus:outline-none mb-1 hover:text-primary-dark transition-all">
                            <span className="mr-1"><IoMdTrash /></span>
                            <span>Delete</span>
                        </a>
                    </div>
                </div>}
            </div>
        </OutsideClickDetect>

    </>)
}

const List = () => {
    const page_size = 3;
    const [openFilter, setOpenFilter] = useState(false);
    const [reload, setReload] = useState('');

    const isMd = useMediaQuery({ query: MediaQuery.isMd }, undefined, (matches) => {

        if (matches) {
            console.log(matches)
            setOpenFilter(true);
        }
        else {
            console.log(matches)
            setOpenFilter(false);
        }
    });

    const location  = useLocation();

    const state = useAsync(async () => {
        const res = await Fetch.postWithAccessToken<ResponseType>('/api/podcasts/list.admin', {
            ...Helper.getURLParams(),
            page_size: page_size,
        });

        if (res.status == 200) {
            if (res.data && res.data.code == Code.SUCCESS) {
                return {
                    podcasts: res.data.podcasts,
                    podcast_num: res.data.podcast_num
                }
            }
        }

        return {
            podcasts: [],
            podcast_num: 0
        }
    }, [Helper.setAndGetURLParam([]), reload]);

    const [selected_podcast, setSelectedPodcast] = useState<RawPodcast>();
    return (
        <>
            <Meta title={`WELE | Podcasts`} />
            <Link to='/admin/podcasts/create'>
                <a className="fixed bottom-14 right-14 cursor-pointer px-2 py-2 text-white flex items-center justify-center bg-primary hover:bg-primary-dark rounded-full shadow-md text-2xl ">
                    <span><FaPlus /> </span>
                </a>

            </Link>

            <div className="flex md:none font-medium justify-end mb-8">
                <div onClick={() => setOpenFilter(true)}
                    className="flex cursor-pointer hover:text-primary fixed items-center">
                    <span>Lọc</span> <span><FiFilter /></span>
                </div>
            </div>
            <div className="w-full flex">
                <div className="w-full md:w-3/4 md:pr-7">
                    {
                        (state.loading) ? [1, 2, 3, 4, 5].map((e) => (
                            <div key={e} className="shadow rounded-md px-3 py-2 w-full mx-auto mb-2">
                                <div className="animate-pulse flex flex-col xs:flex-row space-x-3">
                                    <div className=" rounded bg-gray-200  h-24 xs:w-36 w-full"></div>
                                    <div className="flex-1 space-y-1 py-1">
                                        <div className="h-11 bg-gray-200 rounded w-full"></div>
                                        <div className="">
                                            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : ((state.value?.podcasts as RawPodcast[]).length > 0 ? (state.value?.podcasts as RawPodcast[]).map((podcast, index) => {
                            return (
                                <div key={podcast.id} className=" inline-block shadow hover:shadow-md transition-all cursor-pointer rounded-md px-3 py-2 w-full mx-auto mb-2">
                                    <div className="flex space-x-3 flex-col xs:flex-row">
                                        <div onClick={() => setSelectedPodcast(podcast)} className=" w-full xs:w-36 h-24  flex-shrink-0 flex items-center justify-center">
                                            {podcast.image_url ? <div style={{ backgroundImage: `url(${Constants.IMAGE_URL + podcast.image_url})` }}
                                                className="rounded bg-gray-200 h-full w-full bg-center bg-cover">
                                            </div> : <span className=" text-6xl text-gray-200">
                                                <FaRegImage />
                                            </span>}

                                        </div>
                                        <div className="flex-1 flex py-1 relative">
                                            <div className="w-full" onClick={() => setSelectedPodcast(podcast)}>
                                                <div className="text-sm w-full overflow-hidden ">
                                                    <span className="text-primary text-sm xs:text-lg font-semibold"> {podcast.name}</span>
                                                    <span className="text-gray-900 text-sm xs:text-lg font-semibold"> {podcast.sub_name}</span>
                                                </div>
                                                <div className="w-full flex justify-between">
                                                    <p className=" text-sm text-gray-500 font-light line-clamp-2">{Helper.extractContentByRegex(podcast.description)}</p>
                                                </div>
                                            </div>
                                            <div className="absolute  xs:block right-0 top-0">
                                                <SmallMenu podcast={podcast} reload={() => setReload(uuid.v4())} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : (<>
                            <div className="w-full px-5 py-5 text-center rounded-lg shadow">
                                <h5>Không có kết quả phù hợp</h5>
                            </div>
                        </>))
                    }
                    {state.value && state.value.podcast_num > page_size &&
                        //@ts-ignore
                        <div className="flex justify-center mt-10 mb-20"><Paginate num_items={state.value.podcast_num} page_size={page_size} current_page={3} /> </div>
                    }
                </div>
                <div className=" w-0 md:w-1/4">
                    <ListFilter openFilter={openFilter || isMd} closeFilter={() => setOpenFilter(false)} />
                </div>
            </div>

            <Modal
                classNames={{
                    modal: "rounded-lg overflow-x-hidden w-11/12"
                }}
                onClose={() => setSelectedPodcast(undefined)} open={!!selected_podcast}>
                <>
                    {selected_podcast && (<>
                        <div className="w-full flex flex-wrap">
                            <div className="w-full">
                                <div className="mt-2 flex">
                                    <p className="mr-2 text-primary font-semibold text-lg" >{selected_podcast.name}</p>
                                    <p className="text-gray-900 font-semibold text-lg" >{selected_podcast.sub_name}</p>
                                </div>
                                <div className="mt-2">
                                    <label className="text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Download Links</label>
                                    <ul className="w-full">
                                        {selected_podcast.download_link.map((link, index) => (
                                            <li key={index} className="flex items-center mb-1">
                                                <h5 className="mr-3 text-sm font-semibold flex-shrink-0 whitespace-nowrap">{link.name}</h5>
                                                <a href={link.link} target="_blank" className="text-sm outline-none focus:outline-none flex-1 line-clamp-1 underline hover:text-primary transition-all">{link.link}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-2 flex flex-wrap">
                                    <div className="mr-3">
                                        <label className="text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Duration</label>
                                        <p className="w-full" >{selected_podcast.duration} seconds</p>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Image Url</label>
                                        <img className="w-full h-auto rounded-lg" src={Constants.IMAGE_URL + selected_podcast.image_url} alt="" />
                                    </div>
                                </div>
                                <div className="mt-2 flex flex-wrap">
                                    <div className="mr-3">
                                        <label className="text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Source Name</label>
                                        <p className="w-full" >{PodcastSource[selected_podcast.source_key].source_name}</p>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Source Url</label>
                                        <p className="w-full" >{PodcastSource[selected_podcast.source_key].source_link}</p>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <label className="text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">File Size</label>
                                    <div className="flex items-center">
                                        <h5 className="font-medium text-base text-gray-600">{selected_podcast.file_size} bytes</h5>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <label className="text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Description</label>
                                    <div className="w-full">
                                        <div className="font-sm bg-gray-50 px-1/5 py-1 rounded-lg">
                                            {ReactHtmlParser(selected_podcast.description)}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <label className="text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Hint</label>
                                    <p className="w-full  px-1.5 py-1 rounded-lg bg-gray-50 text-xs" >{getHintText(selected_podcast.result, selected_podcast.hint)}</p>
                                </div>
                                <div className="mt-2">
                                    <label className="text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">File Path</label>
                                    <div className="w-full">
                                        <div className="font-sm bg-gray-50 px-1/5 py-1 rounded-lg">
                                            {selected_podcast.file_path}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </>)}
                </>
            </Modal>
        </>
    )
}

List.layout = LAYOUT_TYPES.Admin;

export default List;