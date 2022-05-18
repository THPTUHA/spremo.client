import { useState } from "react";
import { PRIVATE, PUBLIC } from "../../Constants";

const POST_OPTIONS = [
    {id: PRIVATE, title: "Post"},
    {id: PUBLIC, title: "Post public"}
]

const PostButton = ({handleSumit}:{handleSumit: any})=>{
    const [option,setOption] = useState(POST_OPTIONS[0]);

    return (
        <div>
            <div>
                <span>{option.title}</span>
               
            </div>
        </div>
    )
}

export default PostButton;