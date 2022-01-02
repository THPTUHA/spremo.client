import { pickSubArray } from "../../utils/random/RandomUtils";

const HINT_RATIO = 0.3;
const FILLER_TEXT = "_____";

// sinh ra 1 mang int la vi tri cac hint
export const generateHint = (text: string) => {
    // convert ve cung mot kieu dau cach
    text = text.replace(/\s+/g, " ");

    let word_count = text.split(" ").length;

    // lay 1 luong tu ngau nhien bang HINT_RATIO * tong so tu lam hint
    let word_indexes = Array.from({ length: word_count }, (_, i) => i);
    let hint_count = Math.floor(word_count * HINT_RATIO);

    let hint_indexes = pickSubArray(word_indexes, hint_count);

    // sort vi tri cua cac hint
    if (hint_indexes != null) {
        hint_indexes = hint_indexes.sort((a, b) => parseInt(a) - parseInt(b));
    }

    return hint_indexes;
};


// lay 1 van ban de hien thi hint tuong trung
export const getHintText = (text: string, hint_indexes: number[]) => {
    // convert ve cung mot kieu dau cach
    text = text.replace(/\s+/g, " ");

    let words = text.split(" ");

    return words.map((val, index) => {
        if (hint_indexes.indexOf(index) > -1) {
            return FILLER_TEXT;
        }

        return val;
    }).join(" ");
};