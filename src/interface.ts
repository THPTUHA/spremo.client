import { Dispatch, SetStateAction } from "react"
import {RawBlog, RawUser } from "./store/types"

export interface DrawTool{
    id: number,
    option: any
}

export interface MessageProps{
    user: RawUser,
    content: string
}


export interface IChat{
    id: number,
    user_id: number,
    send_time: number,
    message: string,
    status: number
}

export interface ChatRes{
    id:number,
    user_ids: number[],
    created_time: number
}

export interface Chat{
    code: number,
    message: string, 
    chat: ChatRes, 
    messages:IChat[],
    user: RawUser,
    users: RawUser[]
}

export interface ChatProps{
    id: number,
    avatar: string,
    users: RawUser[],
    messages: {
        user: RawUser,
        content: string
    }[]
}
