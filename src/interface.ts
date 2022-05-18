import { RawUser } from "./store/types"

export interface DrawTool{
    id: number,
    option: any
}

export interface RectangleProps{
    key: number,
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string,
    stroke: string
    strokeWidth: number,
    rotation: number
}

export interface CircleProps{
    key: number,
    x: number,
    y: number,
    radius: number,
    fill: string,
    stroke: string,
    strokeWidth: number,
    rotation: number
}

export interface TriangleProps{
    key: number,
    x: number,
    y: number,
    radius: number,
    fill: string,
    stroke: string,
    strokeWidth: number,
    sides: number,
    rotation: number,
}

export interface LineProps{
    key: number,
    x: number,
    y: number,
    fill: string,
    stroke: string
    strokeWidth: number,
    rotation: number,
    LineCap: string,
    points:number[],
    scaleX: number,
    scaleY: number,
}

export interface TextProps{
    key: number,
    id: string,
    x: number,
    y: number,
    text: string,
    fontSize: number,
    fontFamily: string,
    fill: string,
    rotation: number,
    width:number,
    height:number
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