import { RawPodcast, RawPodcastChallenge, RawRecordChallengeUser, RawTeamChallenge, RawUser } from "./types";

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

export interface UserRecordResponse {
    user_record: RawRecordChallengeUser,
    podcasts: RawPodcast[],
    podcast_challenges: RawPodcastChallenge[],
    rank: number,
    member_number: number,
    user: RawUser,
    code: number,
    message: string
}

export interface TeamResponse {
    team: RawTeamChallenge,
    users: RawUser[],
    record_challenge_users: RawRecordChallengeUser[],
    rank: number,
    team_number: number,
    code: number,
    message: string
}


export interface PodcastChallengeListen {
    podcast: RawPodcast,
    podcast_challenge?: RawPodcastChallenge,
}

export interface ListUserResponse {
    users: RawUser[],
    record_challenge_users: RawRecordChallengeUser[],
    member_number: number,
    is_register: boolean,
    code: number,
    message: string
}

export interface ListTeamResponse {
    teams: RawTeamChallenge[],
    team_number: number,
    max_member: number,
    is_register: boolean,
    code: number,
    message: string
}