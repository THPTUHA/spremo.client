const FAKE_DATA = {
    IMAGE_URL: "https://cungdecor.vn/wp-content/uploads/2019/04/kien-truc-noi-that-la-gi-xu-huong-thiet-ke-kien-truc-noi-that-hien-nay-02.jpg"
};

const IMAGE_URL = "https://wele.s3.ap-southeast-1.amazonaws.com/";
const DOMAIN = "https://wele-learn.com";

const CERTIFICATIONS = [
    { id: 1, label: "Submitted 10 podcasts", image: "" },
    { id: 2, label: "Submitted 25 podcasts", image: "" },
    { id: 3, label: "Submitted 50 podcasts", image: "" },
    { id: 4, label: "Submitted 100 podcasts", image: "" },
];

const BADGES = [
    { value: 'submitted_1', type: 'submitted', name: 'Nhập môn, bài nộp đầu tiên', image: "/static/label1.png" },
    { value: 'submitted_10', type: 'submitted', name: 'Liên tục ghi điểm, 10 bài nộp', image: "/static/label2.png" },
    { value: 'submitted_20', type: 'submitted', name: 'Không thể ngăn cản, 20 bài nộp', image: "/static/label3.png" },
    { value: 'submitted_50', type: 'submitted', name: 'Vang danh bốn bể, 50 bài nộp', image: "/static/label1.png" },
    { value: 'submitted_100', type: 'submitted', name: 'Huyền thoại sống, 100 bài nộp', image: "/static/label1.png" },
    { value: 'consistent_listening_5', type: 'listening', name: 'Chăm chỉ luyện tập, 5 ngày nghe liên tiếp', image: "/static/label2.png" },
    { value: 'consistent_listening_10', type: 'listening', name: 'Mài sắt nên kim, 10 ngày nghe liên tiếp', image: "/static/label3.png" },
    { value: 'consistent_listening_15', type: 'listening', name: 'Trui rèn mỗi ngày, 15 ngày nghe liên tiếp', image: "/static/label2.png" },
    { value: 'consistent_listening_20', type: 'listening', name: 'Ý chí vững vàng, 20 ngày nghe liên tiếp', image: "/static/label3.png" },
    { value: 'consistent_listening_30', type: 'listening', name: 'Kiên định bất khuất, 30 ngày nghe liên tiếp', image: "/static/label1.png" },
    { value: 'consistent_listening_40', type: 'listening', name: 'Trâu bò đời thật, 40 ngày nghe liên tiếp', image: "/static/label2.png" },
    { value: 'consistent_listening_60', type: 'listening', name: 'Huyền thoại lỳ đòn, 60 ngày nghe liên tiếp', image: "/static/label3.png" },
    { value: 'long_listening_60', type: 'time_listening', name: 'Tập trung cao độ, 60 phút', image: "/static/label1.png" },
    { value: 'long_listening_120', type: 'time_listening', name: 'Tập trung cao độ, 120 phút', image: "/static/label2.png" },
    { value: 'week_1', type: 'billboard_week', name: 'Hạng nhất tuần', image: "/static/label1.png" },
    { value: 'week_2', type: 'billboard_week', name: 'Hạng nhì tuần', image: "/static/label2.png" },
    { value: 'week_3', type: 'billboard_week', name: 'Hạng ba tuần', image: "/static/label3.png" },
    { value: 'month_1', type: 'billboard_month', name: 'Hạng nhất tháng', image: "/static/label1.png" },
    { value: 'month_2', type: 'billboard_month', name: 'Hạng nhì tháng', image: "/static/label2.png" },
    { value: 'month_3', type: 'billboard_month', name: 'Hạng ba tháng', image: "/static/label3.png" }
];

const CHALLENGE = {
    ACTIVE :1,
    UNACTIVE:2,
    DURING: 5,
    FINISHED : 6,
    COMING: 7
}

const Constants = {
    FAKE_DATA,
    IMAGE_URL,
    DOMAIN,
    CERTIFICATIONS,
    BADGES,
    CHALLENGE
};


export const FILLER_TEXT = "_____";

export const LAYOUT_TYPES = {
    Admin: "admin",
    Profile: "profile",
    Home: "home",
}

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

export const ORDER_CHALLENGE = [
    { id: 1, label: "Newest", value: "newest" },
    { id: 2, label: "Oldest", value: "oldest" },
]


export const DownloadSource = [
    { source_key: 0, source_name: "Media Fire" },
    { source_key: 1, source_name: "Dropbox" }
];

export default Constants;

export const USER_ACTION_CODES = {
    ACTION_LISTENING: 1,
    ACTION_WRITTING: 2,
    ACTION_SUBMITTING: 3,
}

export const USER_ACTION_METATYPE = {
    METATYPE_LISTENING: "",
    METATYPE_SUBMIT: 'submit',
    METATYPE_MILESTONE: 'milestone',
    METATYPE_CERTIFICATE: 'certificate',
    METATYPE_SYSTEM: 'system'
}

export const USER_ACTION_STATUS = {
    STATUS_STARTED: 0,
    STATUS_FINISHED: 1,
}

export const exportActionContent = (action: number) => {
    if (action === USER_ACTION_CODES.ACTION_LISTENING) {
        return "has listened to";
    }
    else if (action === USER_ACTION_CODES.ACTION_WRITTING) {
        return "has written to";
    }
    return "";
}

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

export const ChallengeStatus = [
    {key: CHALLENGE.ACTIVE, name:"Active"},
    {key: CHALLENGE.UNACTIVE, name:"Unactive"},
    {key: CHALLENGE.DURING, name:"During"},
    {key: CHALLENGE.FINISHED, name:"Finished"}
]

export const TeamStatus ={
    PUBLIC : 1,
    PRIVATE: 2
}

export const PodcastSource = [
    { source_key: 0, source_name: "6 Minutes English", source_link: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english" },
    { source_key: 1, source_name: "English at work", source_link: "https://www.wele-learn.com/" },
    { source_key: 2, source_name: "Spotlight English", source_link: "https://spotlightenglish.com/" },
    { source_key: 3, source_name: "Others", source_link: "https://wele-learn.com " },
];

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
    DRAW: 5
}

export const EMOTION_IDS = {
    HAPPY : 1,
    SAD : 2,
    ANGRY: 3,
    OK: 4,
    GOOD: 5
}

export const EMOTIONS = [
    {id: EMOTION_IDS.HAPPY},
    {id: EMOTION_IDS.SAD},
    {id: EMOTION_IDS.ANGRY},
    {id: EMOTION_IDS.OK},
    {id: EMOTION_IDS.GOOD}
]
export const SHARE_OPTIONS = [
    {id: PUBLIC, title:"Share to everyone"},
    {id: FRIEND, title:"Share to friend"},
    {id: FRIEND_SPECIFIC, title:"Share to friend specific"}
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
