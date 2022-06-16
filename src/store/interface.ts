import { RawUser } from "./types";

export interface AvatarProps {
    name: string,
    link: string,
    img?: string,
    sub_name?: string,
    size?: number
}

export interface LeaderBoardItemProps {
    id: number,
    rank: number,
    rank_status: number,
    is_pos: boolean,
    avatar: AvatarProps,
    extensions: { info?: string, icon?: JSX.Element }[],
    min_width?: number
}

export interface LeaderBoardProps {
    items: LeaderBoardItemProps[],
    item_number: number,
    item_selected?: number,
    searchComp?: React.ReactNode,
    page?: number,
    setPage?: (value: number) => void,
    title?: string,
    handleData?: (value: number) => void,
    max_width?: number,
    min_width?: number,
    min_height?: number,
}

export interface PerformanceProps {
    time_listen: number,
    point: number,
    member_number: number,
    title: string,
    rank?: number
}

export interface RankRecord {
    last_update: number,
    rank: number,
    status: number
}
