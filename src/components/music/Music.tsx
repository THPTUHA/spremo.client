import { RawBlog, RawMusic } from "../../store/types";
import MusicPlay from "./MusicPlay";

const Music = ({blog}:{blog: RawBlog})=>{
    const data = blog.data as RawMusic;
    return (
        <div className="w-full">
            <div className="ml-4 mb-3">
                <div className="font-medium text-lg">{data.name}</div>
                <div className="italic ">{data.description}</div>
            </div>
            <div className="relative">
                <img src={data.background} style={{maxHeight:200, minHeight:200}} className="w-full"/>
                <div className="absolute bottom-0 w-full text-blue-500">
                    <MusicPlay url={data.url}/>
                </div>
            </div>
        </div>
    )
}

export default Music;