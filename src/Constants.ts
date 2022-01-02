const FAKE_DATA = {
    IMAGE_URL: "https://cungdecor.vn/wp-content/uploads/2019/04/kien-truc-noi-that-la-gi-xu-huong-thiet-ke-kien-truc-noi-that-hien-nay-02.jpg"
};

const IMAGE_URL = "https://wele.s3.ap-southeast-1.amazonaws.com/";
const DOMAIN = "https://wele-learn.com";

const ROLES = {
    Admin: 1
}

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
    JOIN : 3,
    UNJOIN : 4,
    FINSHED:5,
    COMING:6,
    DURING:7
}

const Constants = {
    FAKE_DATA,
    IMAGE_URL,
    DOMAIN,
    ROLES,
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
    { id: 1, label: "Oldest", value: "oldest" },
    { id: 3, label: "Most view", value: "mostview" },
]

export const PodcastSource = [
    { source_key: 0, source_name: "6 Minutes English", source_link: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english" },
    { source_key: 1, source_name: "English at work", source_link: "https://www.wele-learn.com/" },
    { source_key: 2, source_name: "Spotlight English", source_link: "https://spotlightenglish.com/" },
    { source_key: 3, source_name: "Others", source_link: "https://wele-learn.com " },
];

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
    apiKey: "AIzaSyCZMt4QsJtfaWQtGlaa6sNY1dmBZGZUFtA",
    authDomain: "wele-test.firebaseapp.com",
    projectId: "wele-test",
    storageBucket: "wele-test.appspot.com",
    messagingSenderId: "436382744824",
    appId: "1:436382744824:web:d1820293ad45c868fbfb0d",
    measurementId: "G-GDR240L6VS"
} : {
    apiKey: "AIzaSyA4qy9h2VN5IhpsukW9bqwGDdq4Q0GjcP4",
    authDomain: "wele-data.firebaseapp.com",
    projectId: "wele-data",
    storageBucket: "wele-data.appspot.com",
    messagingSenderId: "841968592154",
    appId: "1:841968592154:web:9412fd3726ace7faa238a3",
    measurementId: "G-VMGG5CX1ZK"
}
