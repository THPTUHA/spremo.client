
import { HiOutlineX } from 'react-icons/hi'
import { BsFilter } from 'react-icons/bs'
import { FaCaretSquareDown, FaCheckSquare, FaRegSquare } from 'react-icons/fa';

import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useMediaQuery } from 'react-responsive'
import { ChallengeStatus, ChallengeType, MediaQuery, ORDERS, PodcastSource } from '../../Constants';
import { PodcastCollectionHook } from '../../store/podcast.collection/hooks';
import { Helper } from '../../services/Helper';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ListFilter from '../../page.components/filter/_ListFilter';
import { MeHook } from '../../store/me/hooks';


const SidebarChallenge = ({ openSidebar, setOpenSidebar }: { openSidebar: boolean, setOpenSidebar: (value: boolean) => void }) => {

    const [state_q, setQ] = useState('');
    const [state_order, setOrder] = useState(ORDERS[0]);
    const [type_keys, setTypeKeys] = useState<string[]>([]);
    const [status_keys, setStatusKeys] = useState<string[]>([]);
    const [openFilter, setOpenFilter] = useState(false);
    const me = MeHook.useMe();

    const location  = useLocation();
    const {q, types,status, order} = Helper.getURLParams();

    const navigate = useNavigate();
    useEffect(()=>{
        if (q) {
            setQ(q as string);
        }
    }, [q])

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

    useEffect(()=>{
        if (types) {
            let query_types = (types as string).split('_').filter(e => e != '');
            setTypeKeys(ChallengeType.filter(x => query_types.includes(x.key.toString())).map((e) => e.key.toString()))
        }else{
            setTypeKeys([])
        }
    }, [types])

    useEffect(()=>{
        if (status) {
            let query_status= (status as string).split('_').filter(e => e != '');
            setStatusKeys(ChallengeStatus.filter(x => query_status.includes(x.key.toString())).map((e) => e.key.toString()))
        }else{
            setStatusKeys([])
        }
    }, [status])

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

    const onSelectType = (key: string)  => {
        let new_type_keys = [...type_keys];
        const isChecked = new_type_keys.includes(key);
        if(isChecked){
            new_type_keys = new_type_keys.filter( x=> x != key);
        }
        else{
            new_type_keys.push(key);
        }
        navigate(Helper.getUrlQuery({
            types: new_type_keys.join('_')
        }));
        // return router.push(Helper.getUrlQuery({
        //     collection_ids: new_collection_ids.join('_')
        // }))
    }

    const onSelectStatus = (key: string)  => {
        let new_status_keys = [...status_keys];
        const isChecked = new_status_keys.includes(key);
        if(isChecked){
            new_status_keys = new_status_keys.filter( x=> x != key);
        }
        else{
            new_status_keys.push(key);
        }
        navigate(Helper.getUrlQuery({
            status: new_status_keys.join('_')
        }));
        // return router.push(Helper.getUrlQuery({
        //     collection_ids: new_collection_ids.join('_')
        // }))
    }

    useLocation();
    // const navigate = useNavigate()
    // useEffect(()=> {
    //     // const {q} = Helper.getURLParams();
    //     // console.log(q);
    //     if (search) {
    //         setSearch(search)
    //     }
    // }, [search]);
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
                                <div className=" w-full">
                                    <ListFilter openFilter={openFilter || isMd} closeFilter={() => setOpenFilter(false)} url={"challenges"}/>
                                </div> 
                                <div className="w-full mt-3">
                                    <div
                                        onClick={() => setOpenDropDown_1(!openDropDown_1)}
                                        className="cursor-pointer flex w-full rounded-lg justify-between items-center px-3 py-1.5 shadow">
                                        <span className="text-sm">Type</span>
                                        <span className="text-primary"><FaCaretSquareDown /> </span>
                                    </div>
                                    <CSSTransition
                                        in={openDropDown_1}
                                        classNames="css-dropdown"
                                        timeout={300}
                                        unmountOnExit={true}
                                    >
                                        <ul className="list-none overflow-hidden">
                                            {ChallengeType.map((item) => (
                                                <li key={item.key} className="">
                                                    <button onClick={()=> onSelectType(item.key.toString())}
                                                    className=" w-full outline-none focus:outline-none cursor-pointer text-sm text-gray-700 flex items-center pt-1.5 px-2.5">
                                                        {type_keys.includes(item.key.toString()) ? 
                                                        <span className="mr-2 text-primary"> <FaCheckSquare /> </span>
                                                        : <span className="mr-2"> <FaRegSquare /> </span>}
                                                        <span> {item.name} </span>
                                                    </button>
                                                </li>
                                            ))}
                                           
                                        </ul>
                                    </CSSTransition>
                                </div>
                                <div className="w-full mt-3">
                                    <div
                                        onClick={() => setOpenDropDown_2(!openDropDown_2)}
                                        className="cursor-pointer flex w-full rounded-lg justify-between items-center px-3 py-1.5 shadow">
                                        <span className="text-sm">Status</span>
                                        <span className="text-primary"><FaCaretSquareDown /> </span>
                                    </div>
                                    <CSSTransition
                                        in={openDropDown_2}
                                        classNames="css-dropdown"
                                        timeout={300}
                                        unmountOnExit={true}
                                    >
                                        <ul className="list-none overflow-hidden">
                                            {ChallengeStatus.map((item) => (
                                                <li key={item.key} className="">
                                                    {
                                                        (item.key!=1 || (me && me.role==1)) &&(
                                                            <button onClick={()=> onSelectStatus(item.key.toString())}
                                                            className=" w-full outline-none focus:outline-none cursor-pointer text-sm text-gray-700 flex items-center pt-1.5 px-2.5">
                                                                {status_keys.includes(item.key.toString()) ? 
                                                                <span className="mr-2 text-primary"> <FaCheckSquare /> </span>
                                                                : <span className="mr-2"> <FaRegSquare /> </span>}
                                                                <span> {item.name} </span>
                                                            </button>
                                                        )
                                                    }
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