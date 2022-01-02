import React, {  useMemo } from 'react';
import * as _ from 'lodash';
import { useLocation ,Link} from 'react-router-dom';

import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { Helper } from '../../services/Helper';



interface Props {
    num_items: number,
    page_size: number
}

const Pagination = React.memo(({ num_items, page_size }: Props) => {
    const page = Helper.getPageParam();
    const real_current_page = useMemo(() => page ? Number(page) : 1, [page]);

    const pages = useMemo(() => {
        const start = 1;

        var end = Math.floor(num_items / page_size) + 1;

        if (num_items % page_size != 0) {
            end += 1;
        }
        return _.range(start, end);
    }, [num_items, page_size])

    const paginateRender = (page_index: number) => {
        return Helper.setAndGetURLParam([{ key: 'page', value: page_index }])
    }
    
    if (pages.length > 6) {
        if (real_current_page > pages.length - 2) {
            return <ul className=" w-72 flex justify-between items-center text-gray-600" data-uk-margin>
                <li><Link to={`?${paginateRender(real_current_page - 1)}`} >
                    <a className="font-bold">
                        <span> <BsArrowLeft />  </span>
                    </a>
                </Link></li>
                <li>
                    <Link to={`?${paginateRender(1)}`} >
                        <a className="font-bold">
                            1
                        </a>
                    </Link>
                </li>
                <li>
                    <Link to={`?${paginateRender(2)}`} >
                        <a className="font-bold">
                            2
                        </a>
                    </Link>
                </li>
                <li className=""><span>…</span></li>
                {
                    pages.slice(real_current_page - 2, pages.length).map(e => (
                        <li className={`${real_current_page == e ? 'font-bold text-black' : 'text-gray-400'}`} key={e}>
                            <Link to={`?${paginateRender(e)}`} >
                                <a className="font-bold">
                                    {e}
                                </a>
                            </Link>
                        </li>
                    ))
                }
                {real_current_page < pages.length && <li><Link to={`?${paginateRender(real_current_page + 1)}`}>
                    <a className="font-bold">
                        <span > <BsArrowRight />  </span>
                    </a>
                </Link></li>}
            </ul>
        } else if (real_current_page < 3) {
            return <ul className=" w-72 flex justify-between items-center text-gray-600 " data-uk-margin>
                <li><Link to={`?${paginateRender(real_current_page - 1)}`} >
                    <a className="font-bold">
                        <span> <BsArrowLeft />  </span>
                    </a>
                </Link></li>
                {
                    [1, 2, 3].map(e => (
                        <li className={`${real_current_page == e ? ' font-bold text-black' : 'text-gray-400'}`} key={e}><Link to={`?${paginateRender(e)}`} >
                            <a className="font-bold">
                                {e}
                            </a>
                        </Link></li>
                    ))
                }
                <li className=""><span>…</span></li>
                {
                    pages.slice(pages.length - 3, pages.length).map(e => (
                        <li className={`${real_current_page == e ? 'font-bold text-black' : 'text-gray-400'}`} key={e}><Link to={`?${paginateRender(e)}`} >
                            <a className="font-bold">
                                {e}
                            </a>
                        </Link></li>
                    ))
                }
                {real_current_page < pages.length && <li><Link to={`?${paginateRender(real_current_page + 1)}`}>
                    <a className="font-bold">
                        <span > <BsArrowRight />  </span>
                    </a>
                </Link></li>}
            </ul>
        } else {
            return <ul className=" w-72 flex justify-between items-center text-gray-600" data-uk-margin>
                <li><Link to={`?${paginateRender(real_current_page - 1)}`} >
                    <a className="font-bold">
                        <span> <BsArrowLeft />  </span>
                    </a>
                </Link></li>
                {
                    [1, 2].map(e => (
                        <li className={`${real_current_page == e ? 'font-bold text-black' : 'text-gray-400'}`} key={e}><Link to={`?${paginateRender(e)}`} >
                            <a className="font-bold">
                                {e}
                            </a>
                        </Link></li>
                    ))
                }
                <li className=""><span>…</span></li>
                {
                    pages.slice(real_current_page - 1, real_current_page + 1).map(e => (
                        <li className={`${real_current_page == e ? 'font-bold text-black' : 'text-gray-400'}`} key={e}><Link to={`?${paginateRender(e)}`} >
                            <a className="font-bold">
                                {e}
                            </a>
                        </Link></li>
                    ))
                }
                <li className=""><span>…</span></li>
                {
                    pages.slice(pages.length - 2, pages.length).map(e => (
                        <li className={`${real_current_page == e ? 'font-bold text-black' : 'text-gray-400'}`} key={e}><Link to={`?${paginateRender(e)}`} >
                            <a className="font-bold">
                                {e}
                            </a>
                        </Link></li>
                    ))
                }
                {real_current_page < pages.length && <li><Link to={`?${paginateRender(real_current_page + 1)}`}>
                    <a className="font-bold">
                        <span > <BsArrowRight />  </span>
                    </a>
                </Link></li>}
            </ul>
        }
    }
    return (
        <ul className=" w-32 flex justify-between items-center text-gray-600">
            {real_current_page > 1 && <li><Link to={`?${paginateRender(real_current_page - 1)}`} >
                <a className="font-bold">
                    <span> <BsArrowLeft />  </span>
                </a>
            </Link></li>}
            {
                pages.map(e => (
                    <li className={`${real_current_page == e ? 'font-bold text-black' : 'text-gray-400'}`} key={e}><Link to={`?${paginateRender(e)}`} >
                        <a className="font-bold">
                            {e}
                        </a>
                    </Link></li>
                ))
            }
            {real_current_page < pages.length && <li><Link to={`?${paginateRender(real_current_page + 1)}`}>
                <a className="font-bold">
                    <span > <BsArrowRight />  </span>
                </a>
            </Link></li>}
        </ul>
    )
});

export default Pagination;