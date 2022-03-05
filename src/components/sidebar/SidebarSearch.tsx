
import { HiOutlineX } from 'react-icons/hi'
import { BsFilter } from 'react-icons/bs'
import { FaCaretSquareDown, FaCheckSquare, FaRegSquare } from 'react-icons/fa';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useMediaQuery } from 'react-responsive'
import { ChallengeType, MediaQuery, ORDERS, PodcastSource, Search } from '../../Constants';
import { PodcastCollectionHook } from '../../store/podcast.collection/hooks';
import { Helper } from '../../services/Helper';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

interface Tag{
    id:number,
    name:string
    value: number,
    type: string,
    label: string,
    selected: boolean
}

const SidebarChallenge = ({ openSidebar, setOpenSidebar }: { openSidebar: boolean, setOpenSidebar: (value: boolean) => void }) => {

    const [state_q, setQ] = useState('');
    const [state_order, setOrder] = useState(ORDERS[0]);

    const map_tag = useRef({} as {[id:number]:boolean});
    useLocation();
    const {q, challenge_type,challenge_status,podcast_q,challenge_q,collection_ids,source_keys, order} = Helper.getURLParams();

    const state_podcast_q = useMemo(()=>{
        const tag_selected = Search.tags.filter((tag)=>tag.type == "podcast");
        if(podcast_q) tag_selected[0].selected = true;
        else tag_selected[0].selected = false;
        return tag_selected[0];
    },[podcast_q]);

    const state_challenge_q = useMemo(()=>{
        const tag_selected = Search.tags.filter((tag)=>tag.type == "challenge");
        if(challenge_q) tag_selected[0].selected = true;
        else tag_selected[0].selected = false;
        return tag_selected[0];
    },[challenge_q]);

    const state_source_keys = useMemo(()=>{
        const tags_selected = Search.tags.filter((tag)=>tag.type == "source_key");
        if(source_keys){
            const ids = source_keys.split("_");
            for(const tag of tags_selected)
                if(ids.includes(tag.value+"")) tag.selected = true;
                else tag.selected = false;
        }
        return tags_selected;
    },[source_keys]);

    const state_challenge_type = useMemo(()=>{
        const tags_selected = Search.tags.filter((tag)=>tag.type == "challenge_type");
        if(challenge_type){
            console.log(typeof challenge_type);
            const ids = challenge_type.split("_");
            for(const tag of tags_selected)
                if(ids.includes(tag.value+"")) tag.selected = true;
                else tag.selected = false;
        }
        return tags_selected;
    },[challenge_type]);

    const state_collection_ids = useMemo(()=>{
        const tags_selected = Search.tags.filter((tag)=>tag.type == "collection");
        if(collection_ids){
            const ids = collection_ids.split("_");
            for(const tag of tags_selected)
                if(ids.includes(tag.value+"")) tag.selected = true;
                else tag.selected = false;
        }
        return tags_selected;
    },[collection_ids]);

    const state_challenge_status = useMemo(()=>{
        const tags_selected = Search.tags.filter((tag)=>tag.type == "challenge_status");
        if(challenge_status){
            const ids = collection_ids.split("_");
            for(const tag of tags_selected)
                if(ids.includes(tag.value+"")) tag.selected = true;
                else tag.selected = false;
        }
        return tags_selected;
    },[challenge_status]);


    const navigate = useNavigate();
    useEffect(()=>{
        if (q) {
            setQ(q as string);
        }
    }, [q])

    useEffect(()=>{
        if (order) {
            const new_order = ORDERS.find(e => e.value == order);
            if (new_order) {
                setOrder(new_order);
            }
        }
    }, [order])
    
    const [openDropDown_1, setOpenDropDown_1] = useState(true);
    const [openDropDown_2, setOpenDropDown_2] = useState(true);

    const isSemiMedium = useMediaQuery({ query: MediaQuery.isSemiMd }, undefined, (matches) => {
        if (matches) {
            setOpenSidebar(true);
        }
        else {

            setOpenSidebar(false);
        }
    });

    useEffect(() => {
        if (!isSemiMedium) {
            setOpenSidebar(false);
        }
    }, [])

    const onSelectTag = (tag: Tag)  => {
        tag.selected = !tag.selected;
        navigate(Helper.getUrlQuery({
            collection_ids: state_collection_ids.filter(tag=>tag.selected).map(tag=>tag.value).join("_"),
            source_keys: state_source_keys.filter(tag=>tag.selected).map(tag=>tag.value).join("_"),
            challenge_type: state_challenge_type.filter(tag=>tag.selected).map(tag=>tag.value).join("_"),
            challenge_status: state_challenge_status.filter(tag=>tag.selected).map(tag=>tag.value).join("_"),
            podcast_q: state_podcast_q.selected? 1: 0,
            challenge_q: state_challenge_q.selected? 1: 0,
        }));
        // return router.push(Helper.getUrlQuery({
        //     collection_ids: new_collection_ids.join('_')
        // }))
    }
    
    useLocation();

    return (
        <>
            {openSidebar ? <div onClick={() => setOpenSidebar(false)} className="fixed semi-md:none h-screen w-screen bg-gray-900 opacity-50"></div> : <></>}
            <div className="absolute top-0 left-0 h-screen">
                <CSSTransition
                    in={openSidebar}
                    timeout={300}
                    classNames="sidebar"
                    unmountOnExit={true}
                >
                    <div className="xl:w-2/12 semi-md:w-1/5 md:w-1/4 sm:w-1/3 xs:w-1/2 w-2/3 box-border
                                        pt-14 bg-white h-full fixed scrollbar-thin scrollbar-thumb-primary scrollbar-track-primary-light overflow-y-auto">
                                            
                        <div className="pl-5 2xl:pl-20 sm:pl-10 pt-3 pr-4 w-full flex flex-col h-full justify-between">
                            <div className="pb-8 border-b border-gray-800 border-opacity-20">
                                <div className="flex items-center">
                                    <span className="text-xl mr-2 text-primary"><BsFilter /></span>
                                    <span className=" text-xs font-semibold">Filters</span>
                                </div>

                                <div className="w-full mt-3">
                                    <div className="cursor-pointer flex w-full rounded-lg justify-between items-center px-3 py-1.5 shadow">
                                        <button onClick={()=> onSelectTag(state_challenge_q)}
                                            className=" outline-none focus:outline-none cursor-pointer text-sm text-gray-700 flex items-center ">
                                                {state_challenge_q.selected? 
                                                <span className="mr-2 text-primary"> <FaCheckSquare /> </span>
                                                : <span className="mr-2"> <FaRegSquare /> </span>}
                                        </button>
                                        <span className="text-sm">Challenge</span>
                                        <span className="text-primary" onClick={() => setOpenDropDown_1(!openDropDown_1)}><FaCaretSquareDown /> </span>
                                    </div>
                                    <div className="cursor-pointer flex w-full rounded-lg justify-between items-center px-3 py-1.5 shadow">
                                        Type
                                    </div>
                                    <CSSTransition
                                        in={openDropDown_1}
                                        classNames="css-dropdown"
                                        timeout={300}
                                        unmountOnExit={true}
                                    >
                                        <ul className="list-none overflow-hidden">
                                            {state_challenge_type.map((tag) => (
                                                <li key={tag.id} className="">
                                                    <button onClick={()=> onSelectTag(tag)}
                                                    className=" w-full outline-none focus:outline-none cursor-pointer text-sm text-gray-700 flex items-center pt-1.5 px-2.5">
                                                        {tag.selected? 
                                                        <span className="mr-2 text-primary"> <FaCheckSquare /> </span>
                                                        : <span className="mr-2"> <FaRegSquare /> </span>}
                                                        <span> {tag.label} </span>
                                                    </button>
                                                </li>
                                            ))}
                                           
                                        </ul>
                                    </CSSTransition>
                                    <div className="cursor-pointer flex w-full rounded-lg justify-between items-center px-3 py-1.5 shadow">
                                        Status
                                    </div>
                                    <CSSTransition
                                        in={openDropDown_1}
                                        classNames="css-dropdown"
                                        timeout={300}
                                        unmountOnExit={true}
                                    >
                                        <ul className="list-none overflow-hidden">
                                            {state_challenge_status.map((tag) => (
                                                <li key={tag.id} className="">
                                                    <button onClick={()=> onSelectTag(tag)}
                                                    className=" w-full outline-none focus:outline-none cursor-pointer text-sm text-gray-700 flex items-center pt-1.5 px-2.5">
                                                        {tag.selected? 
                                                        <span className="mr-2 text-primary"> <FaCheckSquare /> </span>
                                                        : <span className="mr-2"> <FaRegSquare /> </span>}
                                                        <span> {tag.label} </span>
                                                    </button>
                                                </li>
                                            ))}
                                           
                                        </ul>
                                    </CSSTransition>
                                </div>

                                <div className="w-full mt-3">
                                    <div className="cursor-pointer flex w-full rounded-lg justify-between items-center px-3 py-1.5 shadow">
                                        <button onClick={()=> onSelectTag(state_podcast_q)}
                                            className=" outline-none focus:outline-none cursor-pointer text-sm text-gray-700 flex items-center ">
                                                {state_podcast_q.selected? 
                                                <span className="mr-2 text-primary"> <FaCheckSquare /> </span>
                                                : <span className="mr-2"> <FaRegSquare /> </span>}
                                        </button>
                                        <span className="text-sm">Podcast</span>
                                        <span className="text-primary" onClick={() => setOpenDropDown_2(!openDropDown_2)}><FaCaretSquareDown /> </span>
                                    </div>
                                    <div className="cursor-pointer flex w-full rounded-lg justify-between items-center px-3 py-1.5 shadow">
                                        Collections
                                    </div>
                                    <CSSTransition
                                        in={openDropDown_2}
                                        classNames="css-dropdown"
                                        timeout={300}
                                        unmountOnExit={true}
                                    >
                                        <ul className="list-none overflow-hidden">
                                            {state_collection_ids.map((tag) => (
                                                <li key={tag.id} className="">
                                                    <button onClick={()=> onSelectTag(tag)}
                                                    className=" w-full outline-none focus:outline-none cursor-pointer text-sm text-gray-700 flex items-center pt-1.5 px-2.5">
                                                        {tag.selected? 
                                                        <span className="mr-2 text-primary"> <FaCheckSquare /> </span>
                                                        : <span className="mr-2"> <FaRegSquare /> </span>}
                                                        <span> {tag.label} </span>
                                                    </button>
                                                </li>
                                            ))}
                                           
                                        </ul>
                                    </CSSTransition>
                                    <div className="cursor-pointer flex w-full rounded-lg justify-between items-center px-3 py-1.5 shadow">
                                     Source
                                    </div>
                                    <CSSTransition
                                        in={openDropDown_2}
                                        classNames="css-dropdown"
                                        timeout={300}
                                        unmountOnExit={true}
                                    >
                                        <ul className="list-none overflow-hidden">
                                            {state_source_keys.map((tag) => (
                                                <li key={tag.id} className="">
                                                    <button onClick={()=> onSelectTag(tag)}
                                                    className=" w-full outline-none focus:outline-none cursor-pointer text-sm text-gray-700 flex items-center pt-1.5 px-2.5">
                                                        {tag.selected? 
                                                        <span className="mr-2 text-primary"> <FaCheckSquare /> </span>
                                                        : <span className="mr-2"> <FaRegSquare /> </span>}
                                                        <span> {tag.label} </span>
                                                    </button>
                                                </li>
                                            ))}
                                           
                                        </ul>
                                    </CSSTransition>
                                </div>

                            </div>
                        </div>
                    </div>

                </CSSTransition>
            </div>
            <div className="xl:w-2/12 semi-md:w-1/5 w-0"></div>
        </>
    )
}

export default SidebarChallenge;