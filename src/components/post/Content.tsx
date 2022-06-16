import { useEffect, useRef, useState } from "react"
import {CheckListEditor, HeaderEditor, ImageEditor, ListEditor, QuoteEditor, SimpleImageEditor, TextEditor } from "../../store/types";


const Text = (text: TextEditor)=>{
    return (
        <div className='mb-4 mr-5 ml-5'>
            <div dangerouslySetInnerHTML={{ __html: text.data.text }} />
        </div>
    )
}

const Quote = (quote:QuoteEditor) =>{
    return (
        <div className='mb-4 mr-5 ml-5'>
            <div dangerouslySetInnerHTML={{ __html: quote.data.caption }} className="text-xl font-medium"></div>
            <div className="flex italic">
                <span>"</span>
                <div dangerouslySetInnerHTML={{ __html: quote.data.text }} />
                <span>"</span>
            </div>
        </div>
    )
}

const CheckList = (check_list: CheckListEditor) =>{
    // const [list,setList] = useState<{checked: boolean,text: string}[]>(check_list.data.items);
    // const handleCheck = (index: number)=>{
    //     list[index].checked = !list[index].checked;
    //     setList(list.concat());
    // }
    return (
        <div className='mb-5 mr-5 ml-5'>
            {
                check_list.data.items.map((item,index)=>(
                    <div className='flex items-center' key={index}>
                        <input type={'checkbox'} checked={item.checked} onChange={()=>{}} className="rounded-full"/>
                        <div dangerouslySetInnerHTML={{ __html: item.text }} className="ml-2" />
                    </div>
                ))
            }
        </div>
    )
}

const List = (list: ListEditor) =>{
    return (
        <div className="mb-4 mr-5 ml-5">
            {
                list.data.items.map((item,index)=>(
                    <div key={index + 1}>{index}.{item}</div>
                ))
            }
        </div>
    )
}

// const Warning = (waring:Warning) =>{
//     return (
//         <div className="mb-5">
//             <div className="text-yellow-500 flex">
//                 <AiOutlineWarning className="w-5 h-auto"/>
//                 <div>{waring.data.title}</div>
//             </div>
//             <div>{waring.data.message}</div>
//         </div>
//     )
// }

// const Code = (code:Code) =>{
//     return (
//         <div className="mb-5">
//                 <div dangerouslySetInnerHTML={{ __html: code.data.code }} className="" />
//         </div>
//     )
// }
const Header = (header: HeaderEditor) =>{
    return (
        <div className='mb-3 font-medium mr-5 ml-5'>
            {
                header.data.level == 1? 
                    <p className="text-3xl">{header.data.text}</p>
                :header.data.level == 2?
                    <p className="text-2xl">{header.data.text}</p>
                :header.data.level == 3?
                    <p>{header.data.text}</p>
                :header.data.level == 4?
                    <p>{header.data.text}</p>
                :header.data.level == 5?
                    <p>{header.data.text}</p>
                :header.data.level == 6?
                    <p>{header.data.text}</p>
                :<div>{header.data.text}</div>
            }
        </div>
    )
}

const Image = (image: ImageEditor) =>{
    return (
        <div className='mb-5'> 
            {image.data.file && <img src={image.data.file.url} className='w-full'/>}
        </div>
    )
}

const SimpleImage = (image: SimpleImageEditor) =>{
    return (
        <div className='mb-5'> 
            {image.data && <img src={image.data.url} className='w-full'/>}
        </div>
    )
}
const Part = ({item}: {item: any})=>{
    switch(item.type){
        case "paragraph": 
             return <div ><Text {...item}/></div>
        case "quote": 
             return <div ><Quote {...item} /></div>
        case "checklist": 
             return <div ><CheckList {...item} /></div>
        case "header": 
             return <div ><Header {...item}/></div>
        case "image": 
             return <div><Image {...item} /></div>
        case "simpleImage": 
             return <div><SimpleImage {...item} /></div>
        // case "table": 
        //     return <div><Table {...item} /></div>
        case "list": 
            return <div><List {...item} /></div>
        // case "warning": 
        //     return <div><Warning {...item} /></div>
        // case "code": 
        //     return <div><Code {...item} /></div>
         default:
             return <div></div>
    }
}


const Content = ({blog}:{blog: any})=>{
    const [style, setStyle] = useState<any>({});
    const post_ref = useRef<any>(null)

    useEffect(()=>{
        if(post_ref.current){
            if(post_ref.current.clientHeight > 800){
                setStyle({maxHeight:800});
            }
        }
    },[post_ref.current])
    return (
        <div ref={post_ref} className='flex-col mb-4 overflow-hidden relative text-white' style={style}>
            {
                blog.data && blog.data.blocks.map((item: any,index: any)=>(
                    <div key={index}>
                        <Part item={item}/>
                    </div>
                ))
            }
            {
                style.maxHeight && (
                    <div
                        onClick={()=>{setStyle({})}} 
                        className="absolute  w-full from-slate-900 bg-gradient-to-b -bottom-5 h-20 justify-center flex cursor-pointer">
                        <div className="text-xl">Expand</div>
                    </div>
                )
            }
        </div>
    )
}

export default Content;