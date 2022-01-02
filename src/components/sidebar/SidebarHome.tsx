import { BsFilter } from 'react-icons/bs'
import { FaCaretSquareDown, FaCheckSquare, FaRegSquare } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useMediaQuery } from 'react-responsive'
import { MediaQuery, ORDERS, PodcastSource } from '../../Constants';
import { PodcastCollectionHook } from '../../store/podcast.collection/hooks';
import Link from 'next/link';

const Sidebar = ({ openSidebar, setOpenSidebar }: { openSidebar: boolean, setOpenSidebar: (value: boolean) => void }) => {

    const collections = PodcastCollectionHook.useAll();
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
                                                    <Link href={`/podcasts?collection_ids=${collection.id}`}>
                                                        <a className=" w-full outline-none focus:outline-none cursor-pointer text-sm text-gray-700 flex items-center pt-1.5 px-2.5">
                                                            <span className="mr-2"> <FaRegSquare /> </span>
                                                            <span> {collection.name} </span>
                                                        </a>
                                                    </Link>
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
                                            {PodcastSource.map((source, index) => (
                                                <li key={index} className="">
                                                    <Link href={`/podcasts?source_keys=${source.source_key}`}>
                                                        <a className=" w-full outline-none focus:outline-none cursor-pointer text-sm text-gray-700 flex items-center pt-1.5 px-2.5">
                                                            <span className="mr-2"> <FaRegSquare /> </span>
                                                            <span> {source.source_name} </span>
                                                        </a>
                                                    </Link>
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