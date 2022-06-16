import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAsync } from "react-use";
import { Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Helper } from "../../services/Helper";
import { Toast } from "../../services/Toast";
import { RawUser } from "../../store/types";
import Loading from "../loading/Loading";
import LoadingNormal from '../loading/LoadingNormal';

const SearchItem = ({ query}:{query ?:string})=>{
    const [search, setSearch] = useState('');
    const navigate = useNavigate()

    const onSubmit = (e:any) => {
        if (e.key == 'Enter') {
            setSearch("");
            navigate(`../search/${search}`);
        }
    }
    const hints = useAsync(async()=>{
        if(search){
            try {
                const res = await Fetch.postJsonWithAccessToken<{code: number,message: string, tags: string[], users: RawUser[]}>("/api/search/hint",{
                   q: search
                });
    
                if(res.data){
                    const {code,message,tags, users} = res.data;
                    console.log("TAGS",tags);
                    if(code == Code.SUCCESS){
                        return {
                            tags: tags,
                            users: users
                        }
                    }else{
                        Toast.error(message);
                    }
                }
            } catch (error) {
                console.log(error);
                Toast.error("ERROR!!");
            }
        }
        return {
            tags: [],
            users: []
        }
    },[search]);

    const location = useLocation();

    return (
        <div className="w-full -mr-5">
            <div  className='ml-5 flex items-center w-7/12 bg-white rounded justify-between '
                    style={{
                        backgroundColor: "rgb(64,64,64)"
                    }}    
            >
                <div className="flex items-center w-full">
                <label htmlFor='search' className='cursor-pointer pl-3'><AiOutlineSearch className='w-6 h-6 text-white'/></label>
                <input onKeyDown={onSubmit} value={search} type="text" 
                        onChange={(e)=>setSearch(e.target.value)}
                        className="text-white pl-2 h-9 focus:outline-none w-full pb-1" 
                        id="search" placeholder='Search Spremo'
                        style={{
                            backgroundColor: "rgb(64,64,64)"
                        }}    
                />
                </div>
            {   hints.loading && <div className="w-1/6"><Loading/></div>}
            </div>
            {
                !hints.loading  && hints.value &&hints.value.tags.length > 0 &&(
                    <div onClick={()=>{setSearch("")}} className="fixed z-50 ml-5 py-2  px-2 w-1/3  bg-gray-700 text-white">
                        <div>
                            {hints.value.tags.length > 0 && <div className="font-medium text-lg">Tag</div>}
                            {
                                hints.value.tags.map((tag, index)=>(
                                    <div key={index} className="hover:bg-gray-300">
                                        <Link to={`/search/${tag}`}>
                                            <div>#{tag}</div>
                                        </Link>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="w-full mt-2">
                            {hints.value.users.length > 0 &&  <div className="font-medium text-lg">User</div>}
                            {
                                hints.value.users.map((user)=>(
                                    <div key={user.id} className="hover:bg-gray-500">
                                        <Link
                                            to={`/blog/view/${user.username}`}
                                            state= {{ background: location }}
                                            >
                                        <div>@{user.username}</div>
                                        </Link>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default SearchItem