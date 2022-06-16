
export const MediaQuery = {
    is2Xl: `(min-width: 1536px)`,
    isXl: `(min-width: 1280px)`,
    isSemiLg: `(min-width: 1200px)`,
    isLg: `(min-width: 1024px)`,
    isSemiMd: `(min-width: 960px)`,
    isMd: `(min-width: 768px)`,
    isSm: `(min-width: 640px)`,
    isSemiXs: `(min-width: 540px)`,
    isXs: `(min-width: 468px)`
}

export const Code = {
    Error: -1,
    SUCCESS: 1,
    INVALID_PASSWORD: 2,
    INACTIVATE_AUTH: 3,
    NOTFOUND: 4,
    INVALID_AUTH: 5,
    INVALID_INPUT: 6
}

export const PostCastSubmitType = {
    DOING: 1,
    SUBMITTED: 2
}

export const ORDERS = [
    { id: 1, label: "Newest", value: "newest" },
    { id: 2, label: "Oldest", value: "oldest" },
    { id: 3, label: "Most view", value: "mostview" },
]

export const FIREBASE_CONFIG = process.env.NODE_ENV !== 'production' ? {
    apiKey: "AIzaSyAAs6kCWVS_uuHFXuTEQ-3hqjOdAnZQjxE",
    authDomain: "spremo-e2a0f.firebaseapp.com",
    databaseURL: "https://spremo-e2a0f-default-rtdb.firebaseio.com",
    projectId: "spremo-e2a0f",
    storageBucket: "spremo-e2a0f.appspot.com",
    messagingSenderId: "204268237203",
    appId: "1:204268237203:web:e1121553bc3b44b41eb866",
    measurementId: "G-49J9HYZTMJ"
} : {
    apiKey: "AIzaSyAAs6kCWVS_uuHFXuTEQ-3hqjOdAnZQjxE",
    authDomain: "spremo-e2a0f.firebaseapp.com",
    databaseURL: "https://spremo-e2a0f-default-rtdb.firebaseio.com",
    projectId: "spremo-e2a0f",
    storageBucket: "spremo-e2a0f.appspot.com",
    messagingSenderId: "204268237203",
    appId: "1:204268237203:web:e1121553bc3b44b41eb866",
    measurementId: "G-49J9HYZTMJ"
}

export const ChallengeType = [
    {key: 0, name:"Limit Podcast"},
    {key: 1, name:"Unlimit Podcast"},
    {key: 2, name:"Limit Time"},
    {key: 3, name:"UnLimit Time"},
    {key: 4, name:"Team"}
]

export const TEXT_FONTS = [
    'Calibri','Roboto'
]

export const TEXT_SIZES = [8,10,12,14,16,18,21,14,28,32,36,48,60,72,96]

export const COLORS = ["rgb(66, 133, 244)","rgb(45, 211, 84)"," rgb(252, 208, 21)","rgb(247, 147, 30)","rgb(239, 64, 55)",
"rgb(180, 66, 204)","rgb(26, 26, 26)","rgb(255, 255, 255)","rgb(230, 230, 230)","rgb(179, 179, 179)",
"rgb(102, 102, 102)","rgb(71, 41, 41)","rgb(152, 100, 61)","rgb(209, 144, 70)","rgb(255, 195, 130)",
"rgb(255, 220, 180)","rgb(40, 40, 234)","rgb(107, 254, 218)","rgb(47, 244, 47)","rgb(238, 253, 84)",
"rgb(255, 0, 255)","rgb(224, 191, 230)","rgb(20, 149, 136)","rgb(0, 113, 188)","rgb(102, 45, 145)",
"rgb(46, 49, 146)","rgb(0, 113, 188)","rgb(41, 171, 226)","rgb(0, 255, 255)","rgb(0, 169, 157)",
"rgb(34, 181, 115)","rgb(0, 104, 55)","rgb(234, 127, 185)","rgb(193, 39, 45)","rgb(237, 28, 36)",
"rgb(241, 90, 36)","rgb(251, 176, 59)","rgb(252, 238, 33)","rgb(217, 224, 33)","rgb(140, 198, 63)"]

export const SCALES = [1 , 1.2, 1.5 ,1.8, 2];

export const SHAPES = {
    RECTANGLE: {
        id: '1',
        describe: "Rectangle",
    },
    CIRCLE: {
        id: '2',
        describe: "Circle",
    },
    TRIANGLE: {
        id: '3',
        describe: "Triangle",
    },
    SHAPE_DRAW: {
        id: '5',
        describe: "Shape Draw",
    },
    TEXT: {
        id: '6',
        describe: "Text",
    }
}

export const TEXT_COLOR_DEFAULT = COLORS[7];
export const BG_COLOR_DEFAULT = COLORS[0];
const DRAW_STROKE_WIDTH_DEFAULT = 5;
export const SHAPE_STROKE_WIDTH_DEFAULT = 4;
export const TEXT_FONT_DEFAULT =  TEXT_FONTS[0];
const TEXT_SIZE_DEFAULT = TEXT_SIZES[5];
export const COLOR_DEFAULT = COLORS[0];
const SCALE_DEFALUT = SCALES[0];
const SHAPE_ID_DEFALUT = SHAPES.RECTANGLE.id;

export  const TOOLS = {
    SELECT: {
        id: 1,
        describe: "Select",
        option:[]
    },
    DRAW:{
        id: 2,
        describe: "Draw",
        option:{
            stroke_width:DRAW_STROKE_WIDTH_DEFAULT
        }
    },
    TEXT:{
        id: 3,
        describe: "Text",
        option:{
            font: TEXT_FONT_DEFAULT,
            size: TEXT_SIZE_DEFAULT,
            is_typing: false
        }
    },
    FILL: {
        id: 4,
        describe: "Fill",
        option:[]
    },
    SHAPE: {
        id: 5,
        describe: "Shape",
        option:{
            shape_id: SHAPE_ID_DEFALUT,
            stroke_width: SHAPE_STROKE_WIDTH_DEFAULT
        }
    },
    COLOR: {
        id: 6,
        describe: "Color",
        option:{
            color: COLOR_DEFAULT
        }
    },
    ZOOM: {
        id: 7,
        describe: "Zoom",
        option:{
            scale: SCALE_DEFALUT
        }
    },
    UNDO: {
        id: 8,
        describe: "Undo",
        option:[]
    },
    SAVE: {
        id: 9,
        describe: "Save",
        option:[]
    },
    DELETE: {
        id: 10,
        describe: "Delete",
        option:[]
    },
    SHORT_CUT: {
        id: 11,
        describe: "Short Cut",
        option:[]
    },
    DOWLOAD: {
        id: 12,
        describe: "Download",
        option:[]
    },
}


export const KEY_CODE = {
    BACK_SPACE: 8,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    A: 65,
    D: 68,
    F: 70,
    H: 72,
    L: 76,
    M: 77,
    P: 80,
    T: 84,
    V: 86,
    Z: 90,
    SUM: 187
}

export const VOICE_RECORD_STATUS = {
    INIT: 0,
    START: 1,
    DURING: 2,
    PAUSE: 3,
    STOP: 4,
    WAIT_SAVE: 5,
    SAVE_SUCCESSFUL: 6,
    SAVE_FAIL : 7,
}

export const ROLES = {
    GUEST: 0,
    USER: 1,
    ADMIN: 2,
    DEVELOPER: 3,
    CENSOR: 4
}

export const PRIVATE = 1;
export const PUBLIC = 2;
export const FRIEND = 3;
export const DRAFT = 4;
export const FRIEND_SPECIFIC = 5;
export const BAN = 6;

export const SELECTED = 1;

export const BLOG_TYPES = {
    AUDIO: 1,
    IMAGE: 2,
    VIDEO: 3,
    COMBINE: 4,
    DRAW: 5,
    MUSIC: 6,
    NOTE: 7
}

export const EMOTION_IDS = {
    HAPPY : 1,
    SAD : 2,
    ANGRY: 3,
    OK: 4,
    GOOD: 5
}

export const EMOTIONS = [
    {id: EMOTION_IDS.HAPPY, lable: "happy", color: "yellow-500",  border_color: "border-yellow-500"},
    {id: EMOTION_IDS.SAD, lable: "sad" , color: "blue-500" ,border_color:"border-blue-500"},
    {id: EMOTION_IDS.ANGRY,lable: "angry", color: "red-500" , border_color: "border-red-500"},
    {id: EMOTION_IDS.OK, lable: "ok" , color:" white" , border_color: "boder-white"},
    {id: EMOTION_IDS.GOOD, lable: "good", color:"orange-500" , border_color: "border-orange-500"}
]
export const SHARE_OPTIONS = [
    {id: PUBLIC, title:"Share to everyone"},
    {id: FRIEND, title:"Share to friends"},
    {id: FRIEND_SPECIFIC, title:"Share to specific friends"}
]

export const ENDPOINT =  "http://127.0.0.1:3001";

export const STYLE_ANGRY = {
    text_color:"red" ,
}

export const STYLE_SAD = {
    text_color:"rgb(109 40 217)" ,
}

export const STYLE_OK = {
    text_color:"white" ,
}

export const STYLE_GOOD = {
    text_color:"green" ,
}

export const STYLE_HAPPY = {
    text_color:"yellow" ,
}

export const PAGINATION_OPTION = {
    personal: {
        friend_position: -1, 
        following_position: -1, 
        friend_spe_position: -1
    },
    general:{
        page: 1,
        page_size: 10
    }
}

export const SETTINGS = [
    {action: "listen_music", type: ["select", "random"],},
    {action: "read_blog", type: ["select", "random"]},
    {action: "reminder", type: ["select", "random"]},
]

export const BLOG_LIST_LAYOUT = {
    HORIZONTAL: 1,
    VERTICAL: 2
}