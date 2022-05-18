import { useState } from "react"
import {AiOutlineWarning} from 'react-icons/ai';

interface Text {
    data:{
        text: string,
    },
    id: string,
    type: string
}

interface Quote {
    data:{
        alignment: string,
        caption: string,
        text: string
    },
    id: string,
    type: string
}

interface CheckList {
    data:{
        items: [
            {
                checked: boolean,
                text: string
            }
        ]
    },
    id: string,
    type: string
}

interface Header {
    data:{
        level: number,
        text: string
    },
    id: string,
    type: string
}

interface Image {
    type: string,
    data: {
      file: {
        url:
          string
      },
      caption: "",
      withBorder?: boolean,
      stretched?: boolean,
      withBackground?: boolean
    }
  }

interface Table{
    data:{
        content: string[][]
    },
    id: string,
    type: string
} 

interface List{
    data: {
        items: string[]
    },
    id: string,
    type: string
}

interface Warning{
    data:{
        message: string,
        title: string
    },
    id: string,
    type: string
}

interface Code{
    data:{
        code: string
    },
    id: string,
    type: string
}

const Text = (text: Text)=>{
    return (
        <div className=''>
            <div dangerouslySetInnerHTML={{ __html: text.data.text }} />
        </div>
    )
}

const Quote = (quote:Quote) =>{
    return (
        <div className='mb-4'>
            <div dangerouslySetInnerHTML={{ __html: quote.data.caption }} className="text-xl font-medium"></div>
            <div className="flex italic">
                <span>"</span>
                <div dangerouslySetInnerHTML={{ __html: quote.data.text }} />
                <span>"</span>
            </div>
        </div>
    )
}

const CheckList = (check_list: CheckList) =>{
    const [list,setList] = useState<{checked: boolean,text: string}[]>(check_list.data.items);
    // const handleCheck = (index: number)=>{
    //     list[index].checked = !list[index].checked;
    //     setList(list.concat());
    // }
    return (
        <div className='mb-5'>
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

const Table = (table: Table)=>{
    return (
        <table className="w-full border-[1px] mb-4 border-white">
            <tbody className="border-2">
                {
                    table.data.content.map((data,index)=>(
                        <tr key={index}  className="boder-2">
                            {
                                data.map((ct, index)=>(
                                    <th className="boder-l-2" key={index}>{ct}</th>
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

const List = (list: List) =>{
    return (
        <div className="mb-4">
            {
                list.data.items.map((item,index)=>(
                    <div key={index + 1}>{index}.{item}</div>
                ))
            }
        </div>
    )
}

const Warning = (waring:Warning) =>{
    return (
        <div className="mb-5">
            <div className="text-yellow-500 flex">
                <AiOutlineWarning className="w-5 h-auto"/>
                <div>{waring.data.title}</div>
            </div>
            <div>{waring.data.message}</div>
        </div>
    )
}

const Code = (code:Code) =>{
    return (
        <div className="mb-5">
                <div dangerouslySetInnerHTML={{ __html: code.data.code }} className="" />
        </div>
    )
}
const Header = (header: Header) =>{
    return (
        <div className='mb-3 font-medium'>
            {
                header.data.level == 1? 
                    <h1>{header.data.text}</h1>
                :header.data.level == 2?
                    <h2>{header.data.text}</h2>
                :header.data.level == 3?
                    <h3>{header.data.text}</h3>
                :header.data.level == 4?
                    <h4>{header.data.text}</h4>
                :header.data.level == 5?
                    <h5>{header.data.text}</h5>
                :header.data.level == 6?
                    <h6>{header.data.text}</h6>
                :<div>{header.data.text}</div>
            }
        </div>
    )
}

const Image = (image: Image) =>{
    return (
        <div className='mb-5'> 
            <img src={image.data.file.url} className='w-full'/>
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
        case "table": 
            return <div><Table {...item} /></div>
        case "list": 
            return <div><List {...item} /></div>
        case "warning": 
            return <div><Warning {...item} /></div>
        case "code": 
            return <div><Code {...item} /></div>
         default:
             return <div></div>
    }
}

const Content = ({blog}:{blog: any})=>{
    return (
        <div className='flex-col mr-6 mb-4'>
            {
                blog.data && blog.data.blocks.map((item: any,index: any)=>(
                    <div key={index}>
                        <Part item={item}/>
                    </div>
                ))
            }
        </div>
    )
}

export default Content;