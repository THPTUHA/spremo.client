import OutsideClickDetection from "../../components/ui/OutsideClickDetection";
import { ChallengeStatus, ChallengeType, ORDERS, ORDER_CHALLENGE, PodcastSource } from "../../Constants";
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

    const [type_keys, setTypeKeys] = useState<string[]>([]);
    const [status_keys, setStatusKeys] = useState<string[]>([]);
    const [state_order, setOrder] = useState(ORDERS[0]);
    // const router = useRouter();
    useLocation();
    const navigate = useNavigate();
    const {q, types,status, order} = Helper.getURLParams();
    const [openSort, setOpenSort] = useState(false);

    useEffect(()=>{
        if (types) {
            let query_keys = (types as string).split('_').filter(e => e != '');
            setTypeKeys(ChallengeType.filter(x => query_keys.includes(x.key.toString())).map((e) => e.key.toString()))
        }else{
            setTypeKeys([])
        }
    }, [types])

    useEffect(()=>{
        if (status) {
            let query_keys = (status as string).split('_').filter(e => e != '');
            setStatusKeys(ChallengeStatus.filter(x => query_keys.includes(x.key.toString())).map((e) => e.key.toString()))
        }else{
            setStatusKeys([])
        }
    }, [status])

    useEffect(() => {
        if (order) {
            const new_order = ORDER_CHALLENGE.find(e => e.value == order);
            if (new_order) {
                setOrder(new_order);
            }
        }
    }, [order])

    

    const onSetSort = (index: number) => {
        setOpenSort(false);
        let url = Helper.getUrlQuery({
            order: ORDER_CHALLENGE[index].value
        })
        navigate(url)
        // return router.push(url);
    };

    const onRemoveQuery = () => {
        const {origin} = window.location;
        navigate("../challenges",{replace:true})
        // return router.push({
        //     pathname: router.pathname, 
        //     query: {...router.query, q: ''}
        // });
    };

    const onRemoveType = (key: string) => {
        let new_type_keys= [...type_keys];
        new_type_keys = new_type_keys.filter(x => x != key);
        let url = Helper.getUrlQuery({
            types: new_type_keys.join('_')
        })
        navigate(url)
        // return router.push(url);
    }

    const onRemoveStaus = (key: string) => {
        let new_status_keys= [...status_keys];
        new_status_keys = new_status_keys.filter(x => x != key);
        let url = Helper.getUrlQuery({
            status: new_status_keys.join('_')
        })
        navigate(url)
        // return router.push(url);
    }


    const resetAll = () => {
        let url = Helper.getUrlQuery({
            types: "",
            status:"",
            order: "",
            q: ""
        })
        navigate(url)
        // return router.push(url);
    }

    const not_keys = useMemo(() => {
        return !type_keys.length && !status_keys.length && !q 
    },[ type_keys, q,status_keys]);

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
                    {ChallengeType.filter(x => type_keys.includes(x.key.toString())).map((type) => (
                        <div key={type.key} className="cursor-pointer flex shadow-md mb-2 items-center mx-0.5 bg-primary px-2 py-1.5 rounded-full
                        hover:bg-primary-dark transition-all hover:shadow-lg
                    ">
                            <p style={{ maxWidth: '8rem' }} className=" text-white text-sm overflow-hidden cursor-pointer whitespace-nowrap overflow-ellipsis">
                                #{type.name}</p>
                            <span onClick={() => onRemoveType(type.key.toString())} className="ml-1 text-white">
                                <IoMdCloseCircle />
                            </span>
                        </div>
                    ))}
                    {ChallengeStatus.filter(x => status_keys.includes(x.key.toString())).map((type) => (
                        <div key={type.key} className="cursor-pointer flex shadow-md mb-2 items-center mx-0.5 bg-primary px-2 py-1.5 rounded-full
                        hover:bg-primary-dark transition-all hover:shadow-lg
                    ">
                            <p style={{ maxWidth: '8rem' }} className=" text-white text-sm overflow-hidden cursor-pointer whitespace-nowrap overflow-ellipsis">
                                #{type.name}</p>
                            <span onClick={() => onRemoveStaus(type.key.toString())} className="ml-1 text-white">
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
                                    {ORDER_CHALLENGE.map((order, index) => (
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