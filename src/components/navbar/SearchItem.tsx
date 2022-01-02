import { useRouter } from 'next/router';
// import LogEvent from 'packages/firebase/LogEvent';
import React, { useState } from 'react';
import { useEffect } from 'react';


const SearchItem = () => {
    // const route = useRouter();
    const [search, setSearch] = useState('');
    // useEffect(()=> {
    //     if (route.query['q']) {
    //         setSearch(route.query['q'] as string)
    //     }
    // }, [route.query['q']]);

    // const onSubmit = (e:any) => {
    //     // LogEvent.sendEvent("search_item.filter");
    //     if (e.key === 'Enter') {
    //         route.push({
    //             pathname: 'podcasts', 
    //             query: {...route.query, q: search}
    //         })
    //     }
    // }

    return (
        <input autoComplete={undefined} id="search" className="focus:outline-none bg-transparent"
            type="text" placeholder="Search..." value={search} 
            onChange={(e) => setSearch(e.target.value)}
            // onKeyDown={onSubmit}
        />
    )
};

export default SearchItem;
