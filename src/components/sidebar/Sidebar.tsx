
import { HiOutlineX } from 'react-icons/hi'
import { BsFilter } from 'react-icons/bs'
import { FaCaretSquareDown, FaCheckSquare, FaRegSquare } from 'react-icons/fa';

import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useMediaQuery } from 'react-responsive'
import { MediaQuery, ORDERS, PodcastSource } from '../../Constants';
import { PodcastCollectionHook } from '../../store/podcast.collection/hooks';
import { Helper } from '../../services/Helper';
import { useRouter } from 'next/router';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Sidebar = ({ openSidebar, setOpenSidebar }: { openSidebar: boolean, setOpenSidebar: (value: boolean) => void }) => {

    const [state_collection_ids, setCollectionIds] = useState<string[]>([]);
    const [state_q, setQ] = useState('');
    const [state_source_keys, setSourceKeys] = useState<string[]>([]);
    const [state_order, setOrder] = useState(ORDERS[0]);

    useLocation();
    const {q, collection_ids, source_keys, order} = Helper.getURLParams();

    const collections = PodcastCollectionHook.useAll();
    const navigate = useNavigate();
    useEffect(()=>{
        if (q) {
            setQ(q as string);
        }
    }, [q])

    useEffect(()=>{
        if (source_keys) {
            let query_source_keys = (source_keys as string).split('_').filter(e => e != '');
            setSourceKeys(query_source_keys);
        }
        else{
            setSourceKeys([])
        }
    }, [source_keys])

    useEffect(()=>{
        if (collection_ids) {
            let query_collection_ids = (collection_ids as string).split('_').filter(e => e != '');

            setCollectionIds(collections.filter(x => query_collection_ids.includes(x.id.toString())).map((e, idx) => e.id.toString()))
        }
        else{
            setCollectionIds([])
        }
    }, [collection_ids])

    useEffect(()=>{
        if (order) {
            const new_order = ORDERS.find(e => e.value == order);
            if (new_order) {
                setOrder(new_order);
            }
        }
    }, [order])

    // const setQuery = () => {
    //     var queries: string[] = [];
    //     if (collection_ids.length > 0) {
    //         queries.push(`collection_ids=${collection_ids.join('_')}`);
    //     }

    //     if (source_names.length > 0) {
    //         queries.push(`source_names=${source_names.join('_')}`);
    //     }

    //     if (q) {
    //         queries.push(`q=${q}`);
    //     }

    //     if (query.get('page')) {
    //         queries.push(`page=${query.get('page')}`);
    //     }

    //     queries.push(`order=${order.value}`)

    //     AppRouterContext.ref.props.history.push(`?${queries.join('&')}`);
    // }

    const [openDropDown, setOpenDropDown] = useState(true);
    const [openDropDown2, setOpenDropDown2] = useState(true);

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


    const onSelectCollection = (id: string, isChecked: boolean)  => {
        let new_collection_ids = [...state_collection_ids];
        if(isChecked){
            new_collection_ids = state_collection_ids.filter( x=> x != id);
        }
        else{
            new_collection_ids = [...state_collection_ids,id];
        }
        navigate(Helper.getUrlQuery({
            collection_ids: new_collection_ids.join('_')
        }));
        // return router.push(Helper.getUrlQuery({
        //     collection_ids: new_collection_ids.join('_')
        // }))
    }

    const onSelectSource= (source_key: string, isChecked: boolean)  => {
        let new_sources = [...state_source_keys]
        if(isChecked){
            new_sources = state_source_keys.filter( x=> x != source_key);
        }
        else{
            new_sources = [...state_source_keys,source_key];
        }
        navigate(Helper.getUrlQuery({
            source_keys: new_sources.join('_')
        }));
        // return router.push(Helper.getUrlQuery({
        //     source_keys: new_sources.join('_')
        // }))
    }

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
                                    <div
                                        onClick={() => setOpenDropDown(!openDropDown)}
                                        className="cursor-pointer flex w-full rounded-lg justify-between items-center px-3 py-1.5 shadow">
                                        <span className="text-sm">Collections</span>
                                        <span className="text-primary"><FaCaretSquareDown /> </span>
                                    </div>

                                    <CSSTransition
                                        in={openDropDown}
                                        classNames="css-dropdown"
                                        timeout={300}
                                        unmountOnExit={true}
                                    >
                                        <ul className="list-none overflow-hidden">
                                            {collections.map((collection, index) => (
                                                <li key={collection.id} className="">
                                                    <button onClick={()=> onSelectCollection(collection.id.toString(), state_collection_ids.includes(collection.id.toString()))}
                                                    className=" w-full outline-none focus:outline-none cursor-pointer text-sm text-gray-700 flex items-center pt-1.5 px-2.5">
                                                        {state_collection_ids.includes(collection.id.toString()) ? 
                                                        <span className="mr-2 text-primary"> <FaCheckSquare /> </span>
                                                        : <span className="mr-2"> <FaRegSquare /> </span>}
                                                        <span> {collection.name} </span>
                                                    </button>
                                                </li>
                                            ))}
                                           
                                        </ul>
                                    </CSSTransition>
                                </div>

                                <div className="w-full mt-3">
                                    <div
                                        onClick={() => setOpenDropDown2(!openDropDown2)}
                                        className="cursor-pointer flex w-full rounded-lg justify-between items-center px-3 py-1.5 shadow">
                                        <span className="text-sm">Source</span>
                                        <span className="text-primary"><FaCaretSquareDown /> </span>
                                    </div>

                                    <CSSTransition
                                        in={openDropDown2}
                                        classNames="css-dropdown"
                                        timeout={300}
                                        unmountOnExit={true}
                                    >
                                        <ul className="list-none overflow-hidden">
                                            { PodcastSource.map((source, index) => (
                                                <li key={index} className="">
                                                    <button onClick={()=> onSelectSource(source.source_key.toString(), state_source_keys.includes(source.source_key.toString()))}
                                                    className=" w-full outline-none focus:outline-none cursor-pointer text-sm text-gray-700 flex items-center pt-1.5 px-2.5">
                                                        {state_source_keys.includes(source.source_key.toString()) ? 
                                                        <span className="mr-2 text-primary"> <FaCheckSquare /> </span>
                                                        : <span className="mr-2"> <FaRegSquare /> </span>}
                                                        <span> {source.source_name} </span>
                                                    </button>
                                                </li>
                                            ))}
                                           
                                        </ul>
                                    </CSSTransition>
                                </div>
                            </div>
                            <div className="flex pb-5 w-full justify-center">
                            </div>
                        </div>
                    </div>

                </CSSTransition>
            </div>
            <div className="xl:w-2/12 semi-md:w-1/5 w-0"></div>
        </>
    )
}

export default Sidebar;