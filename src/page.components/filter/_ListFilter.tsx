
import { FiSearch } from 'react-icons/fi';
import { TiDelete } from 'react-icons/ti';
import $ from 'jquery'
import { useNavigate} from 'react-router-dom';
import { CSSTransition } from "react-transition-group";

import SearchItem from "../../components/navbar/SearchItem";
import { Helper } from '../../services/Helper';


const ListFilter = ({ openFilter, closeFilter ,url}: { openFilter: boolean, closeFilter: () => void ,url: string}) => {
    const {q, page } = Helper.getURLParams();
    const navigate = useNavigate();
    const setQuery = () => {
        var queries: string[] = [];

        if ($(`#search${url}`).val()) {
            queries.push(`q=${$(`#search${url}`).val()}`);
        }

        if (page) {
            queries.push(`page=${page}`);
        }

        $(`#search${url}`).val("");
        const {pathname } = window.location;
        navigate(`${pathname}?${queries.join('&')}`);
    }

    const onSubmitHandle = () => {
        setQuery();
    }


    const resetAll = () => {
        $("#search").val("");
    }

    return (<>
        {openFilter ? <div onClick={() => closeFilter()}
            className="fixed md:none top-0 left-0 h-screen w-screen bg-gray-900 opacity-50"></div> : <></>}
        <CSSTransition
            in={openFilter}
            timeout={300}
            classNames="list-filter"
            unmountOnExit
        >
            <div className=" md:w-full w-64 px-3 py-2 right-5 bg-white fixed md:static rounded-lg shadow">
                <div className="mb-2">
                    <label className="text-sm text-gray-500 font-semibold" htmlFor="">Từ khoá</label>
                    <div className="flex items-center w-1/2">
                        <SearchItem url={url} size={120}/>
                        <a onKeyDown={onSubmitHandle} onClick={onSubmitHandle} className="cursor-pointer"><span><FiSearch /></span></a>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    {<div onClick={() => resetAll()} className="hover:text-gray-200 hover:bg-red-600 cursor-pointer  px-1 py-0.5 mr-1 mb-1 rounded-full shadow bg-red-400 text-white font-medium text-xs flex items-center"
                    > <span>Xoá filter</span>
                        <span
                            className="text-base"><TiDelete /></span> </div>}

                    {q && <div className="px-1 py-0.5 mr-1 mb-1 rounded-full shadow bg-primary text-white font-medium text-xs flex items-center"
                    > <span>từ khoá: {q}</span>
                        <span onClick={() => { setQuery() }}
                            className="text-base hover:text-400 cursor-pointer"><TiDelete /></span> </div>}
                </div>
            </div>
        </CSSTransition>

    </>)
}

export default ListFilter;