import rootReducer from './rootReducer';
export type RootState = ReturnType<typeof rootReducer>

declare module "react-redux" {
    export type EqualityFnType<TSelected> = (left: TSelected, right: TSelected) => boolean

    export function useSelector<TSelected>(
        selector: (state: RootState) => TSelected,
        equalityFn?: EqualityFnType<TSelected>
    ): TSelected
}

export type UploadImage = {
    name: string,
    src: string,
    file: File
}

export type Param = {
    key: string,
    value: number | string
}


export type RawNotification = {
    id: number,
    user_id: number,
    user_name: string,
    metatype: string,
    object_id: number,
    object_type: string,
    since: number,
    image: string,
    content: string,
    from_avatar: RawImage,
    from_name: string,
    from_id: number,
    status: number,
    action: string,
    link: string
};

export type RawUser = {
    id: number,
    username: string,
    fullname: string,
    facebook: string,
    dayOfBirth: number,
    email: string,
    avatar: string,
    address: string,
    cover_avatar: string,
    sex: string,
    description: string,
    status: number,
    phone: string,
    since: number,
    last_update: number,
    role: number,
    user_type: number[]
};

export type RawImage = {
    id: number,
    link: string,
    name: string
};

export type RawComment = {
    user_id: number,
    id: number,
    user_name: string,
    user_avatar: string,
    last_update: number,
    metatype: string,
    object_id: string,
    object_export: string,
    object_type: string,
    content: string,
    since: number
}

export type RawLoginSession = {
    ip: string,
    id: number,
    start_time: number
}

export type RawBillboard = {
    id: number,
    metatype: string,
    user_id: number,
    score: number,
    since: number,
    last_update: number,
}

export type RawRecord = {
    score: number,
    podcast: number,
    time: number
}


export type RawDownloadLink = {
    name: string,
    link: string
}

export type RawPodcast = {
    id: number,
    name: string,
    sub_name: string,
    views: number,
    metatype: string,
    user_id: number,
    download_link: RawDownloadLink[],
    data: string,
    duration: number,
    image_url: string,
    hint: number[],
    narrator: string,
    source_key: number,
    description: string,
    since: number,
    last_update: number,
    file_size: number,
    file_path: string,
    result: string,
    collections: string[],
    member_count: number,
    status: number,
    members: {
        score: number,
        user_id: number
    }[],

    ///////
    challenges: RawChallenge[],
    state: any,
    point: number,
    podcast_submit: RawPodcastSubmit,
    podcast_challenge: RawPodcastChallenge,
    result_size: number,
    hint_size: number,
}

export type RawPodcastSubmit = {
    id: number,
    metatype: string,
    user_id: number,
    content: string,
    data: string,
    status: number,
    draft: string,
    podcast_id: number,
    podcast_name: string,
    podcast_result: string,
    podcast_hints: number[],
    since: number,
    last_update: number,
    user_name: string,
    user_avatar: string,
    podcast_subname: string,
    current_time_listen: number,
    draft_array: string[],
    compare_result: {
        diffs: any[] ,
        unique_correct_words_num: number,
        miss_phrases: {
            [key: string]: number
        },
        residual_phrases: {
            [key: string]: number
        },
        wrong_phrases: {
            [keys: string]: string[]
        },
        percent: number
    },
    ////
    ans_hint: number,
    ans_without_hint: number,
}

export type RawPodcastCollection = {
    id: number,
    description: string,
    data: string,
    name: string,
    since: number,
    last_update: number,
    views: number,
    position:number
}

export type RawUserActionLog = {
    id: number,
    user_id: number,
    podcast_id: string,
    status: number,
    data: string,
    content: string,
    podcast_image: string,
    podcast_name: string,
    podcast_sub_name: string,
    metatype: string,
    action: number,
    start_time: number,
    end_time: number,
    user_name: string,
    user_avatar: string,
    likes: number,
    like_logs: number[],
    is_public: number,
    allow_comment: boolean,
    comment_count: number,
    comments: RawComment[]
}

export type RawPersonalRecord = {
    id: string,
    user_id: number,
    username: string,
    following_users: string,
    metatype: string,
    submitted_podcasts: number,
    in_progress_podcasts: number,
    cache_vocabs: {
        [key:string]: number
    },
    cache_submits: {
        [key: number]: {
            value: number,
            listen_time: number,
            podcast_id: number,
            podcast_name: string,
            podcast_subname: string,
            record_time: number,
            compare_result: {
                unique_correct_words_num: number,
                miss_phrases: {
                    [key: string]: number
                },
                residual_phrases: {
                    [key: string]: number
                },
                wrong_phrases: {
                    [keys: string]: string[]
                },
                percent: number
            }

        }
    }
}

export type RawVocabItem = {
    correct_word: string,
    wrong_words: string[],
    freq: number,
    record_time: number
}

export type RawTimeListenItem = {
    record_time: number,
    listen_time: number,
    podcast_id: number,
    podcast_name: string,
    podcast_subname: string
}

export type RawPointsItem = {
    record_time: number,
    podcast_id: number,
    podcast_name: string,
    podcast_subname: string,
    value: number,
    accuracy: number
}

export type RawWordsItem = {
    record_time: number,
    podcast_id: number,
    podcast_name: string,
    podcast_subname: string,
    total_words: number,
    wrong_words: number,
    current_listened_words: number
}


export type ReportWordType = {
    label: string,
    freq: number,
    references: string[]
}


export type RawSystemNotification = {
    id: number,
    notification_ids: number[],
    metatype: string,
    is_private: boolean,
    since: number,
    receivers: number[],
    title: string,
    image: string,
    last_update: number,
    link: string,
    content: string,
    data: string,
    publish_time: number,
    user_id: number
}

export type RawCertification = {
    id: number,
    metatype: string,
    since: number,
    last_update: number,
    image: string,
    for_user_id: number,
    for_user_name: string,
    for_user_avatar: string,
    content: string,
    user_id: number,
    user_avatar: string,
    user_name: string,
    certification_type: number,
    user_action_log_id: number,
    data: string
}

export type RawBadge = {
    id: number,
    metatype: string,
    since: number,
    last_update: number,
    value: string, 
    data: string,
    badge_name: string
}


export type RawChallenge = {
    id: number,
    metatype: string,
    name: string,
    user_id: number,
    data:string,
    description: string,
    background_image: string,
    start_time: number,
    end_time: number,
    since: number,
    last_update: number,
    status: number,
    podcast_ids: number[],
    challenge_type: {
        team:{status:boolean, number_member:number},
        limit_time:{status:boolean, time:number},
        limit_podcast:{status:boolean, podcasts:{id:number,point:number}[]}
    },

    podcast_challenges: RawPodcastChallenge [],
    is_join:boolean
}

export type RawRecordChallengeUser ={
    id:number,
    metatype: string,
    user_id:number,
    challenge_id: number;
    data: any;
    since: number;
    last_update: number;
    status: number;
    point: number,
}

export type RawPodcastChallenge = {
    id: number,
    user_id: number,
    podcast_id: number,
    challenge_id: number,
    record_challenge_user_id: number,
    metatype:string,
    data:any,
    draft_array: string,
    point: number,
    listen_time: number,
    last_update: number,
    draft: string,
    status: number,
    compare_result: string,
    results: string,
    current_time_listen: number,
    is_submitted: boolean,
    submit_time: number,
    /////////
    ans_hint: number,
    ans_without_hint: number,
    challenge: RawChallenge
}