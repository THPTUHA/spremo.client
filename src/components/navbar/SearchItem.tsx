import { useRouter } from 'next/router';
import LogEvent from '../../packages/firebase/LogEvent';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helper } from '../../services/Helper';


const SearchItem = ({url, query,size}:{url: string, query ?:string,size ?:number}) => {
    const [search, setSearch] = useState('');
    useLocation();
    const navigate = useNavigate()

    useEffect(()=> {
        // const {q} = Helper.getURLParams();
        // console.log(q);
        if (search) {
            setSearch(search);
        }
    }, [search]);

    const onSubmit = (e:any) => {
        LogEvent.sendEvent("search_item.filter");
        if (e.key == 'Enter') {
            const result = query? {[query]: search} : { q: search }
            navigate(`../${url}${Helper.getUrlQuery(result)}`);
        }
    }

    return (
        <input autoComplete={undefined} id={`search${url}`} className="focus:outline-none bg-transparent" style={{width:size?size:200}}
            type="text" placeholder="Search..." value={search} 
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onSubmit}
        />
    )
};

export default SearchItem;
