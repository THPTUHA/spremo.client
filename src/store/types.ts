import rootReducer from './rootReducer';
export type RootState = ReturnType<typeof rootReducer>

declare module "react-redux" {
    export type EqualityFnType<TSelected> = (left: TSelected, right: TSelected) => boolean

    export function useSelector<TSelected>(
        selector: (state: RootState) => TSelected,
        equalityFn?: EqualityFnType<TSelected>
    ): TSelected
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
    from_avatar: string,
    from_name: string,
    from_id: number,
    status: number,
    action: string,
    link: string,
    data: string,
    
};

export type RawUser = {
    id: number,
    username: string,
	password: string,
    avatar: string,
	contact: string,
    sex: number,
    description: string,
    role: number,
    last_login: number,
    emotional_status: number,
    blog_ids: string,
    group_ids: string,
    email: string,
    last_update: number,
    active_status: number,
    data: any,
    background: string,
    day_of_birth: number,
    follower_number: number,
    is_follow: boolean,
    is_friend: boolean,
    friends: number[],
    following: number[],
    recent_post_number: number,
};


export type RawRecord = {
    id: number,
    user_id: number,
    since: number,
    like_number: number,
    comment_number: number,
    view_number: number,
    blog_number: number
}

export type RawLike = {
    id: number,
    user_id: number,
    since: number,
    emotion_id: number,
    blog_id: number,
    hash_key: string
}

// export type PagintionPersonal = {
//     friend_position: number, 
//     following_position: number, 
//     friend_spe_position: number
// }

// export type PagintionGeneral = {
//     page: number,
//     page_size:  number
// }

// export type Pagination = PagintionPersonal | PagintionGeneral;



export type RectangleProps = {
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

export type CircleProps = {
    key: number,
    x: number,
    y: number,
    radius: number,
    fill: string,
    stroke: string,
    strokeWidth: number,
    rotation: number
}

export type TriangleProps = {
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

export type LineProps  ={
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

export type TextProps = {
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

export type ChatType = {
    id: number,
    avatar: string,
    users: RawUser[],
    messages: {
        user: RawUser,
        content: string
    }[]
}

export type KeyDraw = {
    key: number
}
export type ShapeType = KeyDraw | RectangleProps | CircleProps | TriangleProps | LineProps | TextProps;

export type TextEditor = {
    data:{
        text: string,
    },
    id: string,
    type: string
}

export type QuoteEditor =  {
    data:{
        alignment: string,
        caption: string,
        text: string
    },
    id: string,
    type: string
}

export type CheckListEditor = {
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


export type HeaderEditor = {
    data:{
        level: number,
        text: string
    },
    id: string,
    type: string
}

export type ImageEditor = {
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

export type SimpleImageEditor = {
    type: string,
    data: {
        url:string,
        caption: "",
        withBorder?: boolean,
        stretched?: boolean,
        withBackground?: boolean
    }
}

export type ListEditor = {
    data: {
        items: string[]
    },
    id: string,
    type: string
}

export type RawDraw = {
    description: string,
    shapes: ShapeType[],
    url: string
}

export type RawVoiceRecorder = {
    title: string,
    background: string,
    description: string,
    url: string
}

export type RawMusic = {
    url: string,
    name: string,
    background: string,
    description: string
}

export type RawNote = {
    title: string,
    blocks: TextEditor |  QuoteEditor | CheckListEditor | HeaderEditor | ImageEditor | ListEditor;
}

export type RawTextEditor = {
    blocks: TextEditor |  QuoteEditor | CheckListEditor | HeaderEditor | ImageEditor | ListEditor;
}

export type RawBlog = {
    id: number,
    user_id: number,
    data: RawDraw | RawVoiceRecorder | RawTextEditor | RawMusic,
    last_update: number,
    created_time: number,
    status: number,
    type: number,
    like_number: number,
    comment_number: number,
    user_views: number[],
    selected: number,
    emotion_id: number,
    user: RawUser,
    is_marked: boolean,
    is_edit: boolean,
    is_censored: boolean,
    selected_since: number,
    allow_delete: boolean,
    is_last: boolean,
    tags: string[]
}

export type RawComment = {
    user_id: number,
    id: number,
    username: string,
    user_avatar: string,
    last_update: number,
    object_id: string,
    object_type: string,
    content: string,
    since: number
}

export type RawSetting = {
    id: number,
    emotion_id: number,
    type: string,
    action: string,
    data: {
        blog_ids: number[],
        reminder: string
    },
    blogs: RawBlog[],
    is_active?: boolean
}