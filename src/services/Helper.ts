import { USER_ACTION_METATYPE } from '../Constants';
import { NextRouter } from 'next/router';

import { RawUserActionLog, UploadImage } from '../store/types';
// import { AppRouterContext } from "";

type Param = {
    key: string,
    value: number | string
}
export class Helper {

    static time () {
        return Math.floor(new Date().getTime() / 1000);
    };

    static normalizeUrl(uri: string) {
        return uri.normalize("NFD").replace(/\s/g, "+");
    }

    // static convertMoney(val: number | string) {
    //     const numberString = String(val).replace(
    //         /^\d+/,
    //         number => [...number].map(
    //             (digit, index, digits) => (
    //                 !index || (digits.length - index) % 3 ? '' : ','
    //             ) + digit
    //         ).join('')
    //     );

    //     return numberString;
    // }

    static getQueryString(route: NextRouter){
        return  Object.keys(route.query).map(key => `${key}=${route.query[key]}`).join('&');
    }

    static getUrlQuery(object: any) {
        var array = Object.keys(object).map(e => ({
            key: e,
            value: object[e]
        }));

        return `?${Helper.setAndGetURLParam(array)}`;
    }

    static setAndGetURLParam(params: Param[], is_array = "") {
        if (typeof window !== "undefined") {
            const queries = new URLSearchParams(window.location.search);
            for (let i = 0; i < params.length; i++) {
                if (params[i].value) {
                    queries.set(params[i].key, `${params[i].value}`);
                } else {
                    queries.delete(params[i].key)
                }

            }
            return queries.toString();
        }

        return ""
    }

    static getURLParams() {
        if (typeof window !== "undefined") {
            const queries = new URLSearchParams(window.location.search);
            let result: any = {};
            for (let q of queries) {
                result[q[0]] = q[1] ;
            }
            return result;
        }
        return {}
    }

    static getPageParam() {
        if (typeof window !== "undefined") {
            const queries = new URLSearchParams(window.location.search);
            let result: any = {};
            for (let q of queries) {
               if(q[0]=='page') return q[1];
            }
        }
        return 1;
    }

    static getTime(value:number){
        const days = Math.floor( value / 86400);
        const hours = Math.floor(value % 86400 /3600);
        const minutes = Math.floor(value % 3600 /60);
        const seconds = Math.floor(value % 60);
        return `${days} Ngày ${hours} Giờ ${minutes} Phút ${seconds} Giây`;
    }

    static getHourMinute(value:number){
        const date = new Date(value*1000);
        return date.getHours().toString().padStart(2, '0')+":"+date.getMinutes().toString().padStart(2, '0');
    }

    static generateCode(value: string) {
        return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '_').toLowerCase().substr(0, 100);
    };

    static validLink(value: string) {
        return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '_').toLowerCase();
    };

    static getDay = function (value: number) {
        const date = new Date(value * 1000);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    static getDayWithoutYear = function (value: number) {
        const date = new Date(value * 1000);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    static getUnixNum = function (date?: any) {
        if (!date) {
            date = new Date();
        }
        return Math.round(new Date(date).getTime() / 1000);
    }

    static getDateInputFormat = function (value: number) {
        var date = new Date(value * 1000);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    static getExactDay = function (value: number) {
        var date = new Date(value * 1000);
        if(date.getHours()===0 && date.getMinutes()===0)
            return ` ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return ` ${date.getHours() > 9 ? date.getHours() : "0" + date.getHours().toString() }:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes().toString()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    static uniqueArray<M>(array: M[], key: string) {
        var result_obj: any = {};
        for (let i = 0; i < array.length; i++) {
            //@ts-ignore
            result_obj[array[i][key]] = array[i];
        }

        return Object.values(result_obj).sort((a: any, b: any) => a[key] - b[key]) as M[];
    }

    static convertTime = function (dateInput: Date) {
        const date = new Date(dateInput);
        return ` ${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    static getInnerHeight = function () {
        return window.innerHeight;
    };

    static fullTextSearch = function (arrays: any[], key: string, search_text: string, bonus_keys: string[] = []) {
        if (key) {
            return arrays.filter(e => {
                var r_search_text = search_text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
                var text = e[key].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

                if (text.indexOf(r_search_text) >= 0) {
                    return true
                }
                if (bonus_keys.length > 0) {
                    for (let i = 0; i < bonus_keys.length; i++) {
                        var bonus_text = e[bonus_keys[i]].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

                        if (bonus_text.indexOf(r_search_text) >= 0) {
                            return true
                        }
                    }
                }
                return false;
            })
        }
        else {
            return arrays.filter(e => {
                var r_search_text = search_text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
                var text = e.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

                return text.indexOf(r_search_text) >= 0;
            })
        }
    }

    static shortenText(input: string, length: number) {
        if (input.length > length - 3) {
            return input.slice(0, length) + '...'
        }
        else {
            return input;
        }
    }

    static readDataUrl = function (file: File): Promise<UploadImage> {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            const ref_file = file;
            reader.readAsDataURL(file);
            reader.onloadend = (e) => {
                resolve({
                    src: reader.result as string,
                    name: ref_file.name,
                    file: ref_file
                });
            };
        });
    };

    static extractContentByRegex(s:string) {
        s =  s.replace(/\<(.+?)\>/g, ' ');
        if(s.length>80)s = s.substring(0,80)+"...";
        return s;
    }

    static extractContent(s: string) {
        s = s.replace(/\<(.+?)\>/g, ' ');
        return s;
    };

    static setCookie(name: string, value: string, days: number) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    static getCookie(name: string) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    static getCookieFromReq(name: string, cookies: string) {
        var nameEQ = name + "=";
        var ca = cookies.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    static get21dayslabels() {
        var current_time = Math.floor(new Date().getTime() / 1000);

        var labels: string[] = [];

        for (let index = 21; index > 0; index--) {
            labels.push(this.getDayWithoutYear(current_time - index * 60 * 60 * 24));
        }

        return labels;
    }

    static generateHeaderActionLog(action_log: RawUserActionLog) {
        if (action_log.metatype === USER_ACTION_METATYPE.METATYPE_CERTIFICATE) {
            return `${Helper.extractContent(action_log.content)}`
        }

        if (action_log.metatype === USER_ACTION_METATYPE.METATYPE_MILESTONE) {
            return `${action_log.user_name} completed  ${action_log.content} podcasts`
        }

        if (action_log.metatype === USER_ACTION_METATYPE.METATYPE_LISTENING) {
            if (action_log.end_time && Math.floor((action_log.end_time - action_log.start_time) / 60) > 10) {
                return `${action_log.user_name} have listened to podcast ${action_log.podcast_name} ${action_log.podcast_sub_name} for ${Math.floor((action_log.end_time - action_log.start_time) / 60)} minutes`
            }
            else {
                return `${action_log.user_name} started listening to podcast ${action_log.podcast_name} ${action_log.podcast_sub_name}`
            }
        }

        if (action_log.metatype === USER_ACTION_METATYPE.METATYPE_SUBMIT) {
            return `${action_log.user_name} submitted ${action_log.podcast_name} ${action_log.podcast_sub_name}`

        }

        if (action_log.metatype === USER_ACTION_METATYPE.METATYPE_SYSTEM) {
            return `${action_log.content}`
        }

        return "Welcome to WELE"
    }
};