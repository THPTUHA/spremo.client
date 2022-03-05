import OutsideClickDetection from "../../components/ui/OutsideClickDetection";
import { ORDERS, PodcastSource } from "../../Constants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { BsFillCaretDownFill } from "react-icons/bs";
import { IoMdCloseCircle } from "react-icons/io";
import { CSSTransition } from "react-transition-group";
import { Helper } from "../../services/Helper";
import { PodcastCollectionHook } from "../../store/podcast.collection/hooks";
import { useParams ,useNavigate,useLocation, useSearchParams} from "react-router-dom";


const FilterTag = () => {

    const [hasFilter, setHasFilter] = useState(false);

    const [state_collection_ids, setCollectionIds] = useState<string[]>([]);
    const [state_source_keys, setSourceKeys] = useState<string[]>([]);
    const [state_order, setOrder] = useState(ORDERS[0]);

    const collections = PodcastCollectionHook.useAll();
    // const router = useRouter();
    useLocation();
    const navigate = useNavigate();
    const {q, source_keys, collection_ids, order } = Helper.getURLParams();
    const [openSort, setOpenSort] = useState(false);

    useEffect(()=>{
        if (source_keys) {
            let query_source_keys = (source_keys as string).split('_').filter(e => e != '');
            setSourceKeys(query_source_keys);
        }
        else{
            setSourceKeys([])
        }
    }, [source_keys])

    useEffect(() => {
        if (collection_ids) {
            let query_collection_ids = (collection_ids as string).split('_').filter(e => e != '');
            setCollectionIds(collections.filter(x => query_collection_ids.includes(x.id.toString())).map((e, idx) => e.id.toString()))
        }
        else {
            setCollectionIds([])
        }
    }, [collection_ids])

    useEffect(() => {
        if (order) {
            const new_order = ORDERS.find(e => e.value == order);
            if (new_order) {
                setOrder(new_order);
            }
        }
    }, [order])

    

    const onSetSort = (index: number) => {
        setOpenSort(false);
        let url = Helper.getUrlQuery({
            order: ORDERS[index].value
        })
        navigate(url)
        // return router.push(url);
    };

    const onRemoveQuery = () => {
        const {origin} = window.location;
        navigate("../podcasts",{replace:true})
        // return router.push({
        //     pathname: router.pathname, 
        //     query: {...router.query, q: ''}
        // });
    };

    const onRemoveCategory = (id: string) => {
        let new_collection_ids = [...state_collection_ids];
        new_collection_ids = state_collection_ids.filter(x => x != id);
        let url = Helper.getUrlQuery({
            collection_ids: new_collection_ids.join('_')
        })
        navigate(url)
        // return router.push(url);
    }

    const onRemoveSource = (source: string) => {
        let new_sources = [...state_source_keys]
        new_sources = state_source_keys.filter(x => x != source);
        let url = Helper.getUrlQuery({
            source_keys: new_sources.join('_')
        })
        navigate(url);
        // return router.push(url);
    }

    const resetAll = () => {
        let url = Helper.getUrlQuery({
            source_names: "",
            collection_ids: "",
            q: ""
        })
        navigate(url)
        // return router.push(url);
    }

    const not_keys = useMemo(() => {
        return !state_source_keys.length && !state_collection_ids.length && !q
    },[state_source_keys, state_collection_ids, q]);

    return (<>
        <div className="mb-4 w-full flex items-start justify-between">
            <div className="flex justify-between items-start">
                {!not_keys && <h3 className="none semi-xs:inline-block text-base font-semibold">Keywords:</h3>}
                <div className="flex flex-wrap ml-1">
                    {!!q&& <div className="cursor-pointer flex shadow-md mb-2 items-center mx-0.5 bg-primary px-2 py-1.5 rounded-full
                        hover:bg-primary-dark transition-all hover:shadow-lg
                    ">
                        <p style={{ maxWidth: '8rem' }} className=" text-white text-sm overflow-hidden cursor-pointer whitespace-nowrap overflow-ellipsis">
                            #{q}</p>
                        <span onClick={onRemoveQuery} className="ml-1 text-white">
                            <IoMdCloseCircle />
                        </span>
                    </div>}
                    {collections.filter(x => state_collection_ids.includes(x.id.toString())).map((collection, index) => (
                        <div key={collection.id} className="cursor-pointer flex shadow-md mb-2 items-center mx-0.5 bg-primary px-2 py-1.5 rounded-full
                        hover:bg-primary-dark transition-all hover:shadow-lg
                    ">
                            <p style={{ maxWidth: '8rem' }} className=" text-white text-sm overflow-hidden cursor-pointer whitespace-nowrap overflow-ellipsis">
                                #{collection.name}</p>
                            <span onClick={() => onRemoveCategory(collection.id.toString())} className="ml-1 text-white">
                                <IoMdCloseCircle />
                            </span>
                        </div>
                    ))}
                    {state_source_keys.map((source_key, index) => (
                        <div key={index} className="cursor-pointer flex shadow-md mb-2 items-center mx-0.5 bg-primary px-2 py-1.5 rounded-full
                        hover:bg-primary-dark transition-all hover:shadow-lg
                    ">
                            <p style={{ maxWidth: '8rem' }} className=" text-white text-sm overflow-hidden cursor-pointer whitespace-nowrap overflow-ellipsis">
                                #{PodcastSource[parseInt(source_key)].source_name}</p>
                            <span onClick={() => onRemoveSource(source_key)} className="ml-1 text-white">
                                <IoMdCloseCircle />
                            </span>
                        </div>
                    ))}
                    {!not_keys && <div
                        onClick={() => resetAll()}
                        className="cursor-pointer flex shadow-md mb-2 items-center mx-0.5 bg-primary px-2 py-1.5 rounded-full
                                hover:bg-primary-dark transition-all hover:shadow-lg
                            ">
                        <p style={{ maxWidth: '8rem' }} className=" text-white text-sm overflow-hidden cursor-pointer whitespace-nowrap overflow-ellipsis">
                            Xoá lọc
                        </p>
                        <span className="ml-1 text-white">
                            <IoMdCloseCircle />
                        </span>
                    </div>}
                </div>
            </div>
            <div className="flex-shrink-0">
                <OutsideClickDetection outsideFunc={() => setOpenSort(false)}>
                    <div className=" relative">
                        <div onClick={() => setOpenSort(!openSort)} className=" w-40 flex items-center  cursor-pointer">
                            <p className="text-sm font-semibold mr-1">Sort by:</p>
                            <div className="flex text-base text-primary items-center justify-between flex-1">
                                <span className="inline-block font-semibold mr-1">{state_order.label}</span>
                                <span><BsFillCaretDownFill /></span>
                            </div>

                        </div>
                        <CSSTransition
                            in={openSort}
                            timeout={300}
                            classNames="sort-box"
                            unmountOnExit
                        >
                            <div className="absolute top-full right-0 ">

                                <div className=" min-w-max py-1 rounded shadow bg-white">
                                    {ORDERS.map((order, index) => (
                                        <div
                                            onClick={() => onSetSort(index)}
                                            className="text-gray-800  px-3 py-0.5 cursor-pointer font-medium hover:bg-primary-normal transition-all" key={order.id}>{order.label}</div>
                                    ))}
                                </div>
                            </div>
                        </CSSTransition>
                    </div>
                </OutsideClickDetection>
            </div>

        </div>
    </>)
}

export default FilterTag;