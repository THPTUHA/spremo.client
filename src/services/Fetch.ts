import axios, {AxiosPromise} from "axios";
import {LoadingFunctions} from "../store/loading/functions";


class Fetch {

    private __base_url: string = process.env.NODE_ENV !== "production" ? 'http://localhost:3001' : "https://wele-learn.com";
    private __access_token: string = "";

    setAccessToken(value: string) {
        this.__access_token = value;
    };

    //Not use
    async login({username, password}: {username: string, password: string}){
        return null;
    };

    async postWithAccessToken<ResponseType>(url: string, params: Object, array_fields: string[] = [], show_loading = true): Promise<AxiosPromise<ResponseType>> {
        return await this.post<ResponseType>(url, {
            ...params,
            access_token: this.__access_token,
        }, array_fields, show_loading);
    };

    async postJsonWithAccessToken<ResponseType>(url: string, params: Object): Promise<AxiosPromise<ResponseType>> {
        return await this.postJson<ResponseType>(url, {
            ...params,
            access_token: this.__access_token,
        });
    }

    async postJson<ResponseType>(url: string, params: Object): Promise<AxiosPromise<ResponseType>> {
        // LoadingFunctions.setLoading(true, 0.1);
        const res = axios.post(`${this.__base_url}${url}`, params, {
            // onDownloadProgress: function (progress_event) {
            //     LoadingFunctions.setLoading(true, progress_event.loaded / progress_event.total * 100);
            //     if (progress_event.loaded === progress_event.total) {
            //         LoadingFunctions.setLoading(false, 0);
            //     }
            // }
        });
        return res;
    };

    get<ResponseType>(url: string): Promise<AxiosPromise<ResponseType>> {
        return axios.get(`${this.__base_url}${url}`);
    };

    async post<ResponseType>(url: string, params: any, array_fields: string[] = [], show_loading = true): Promise<AxiosPromise<ResponseType>> {
        LoadingFunctions.setLoading(true, 0.1, show_loading);
        var form_data = new FormData();
        for (let k in params) {

            if (array_fields.indexOf(k) > -1) {
                for (let i = 0; i < params[k].length; i++) {
                    form_data.append(k + '[]', params[k][i]);
                }
            } else {
                if (params[k] != null && params[k] != undefined) {
                    //@ts-ignore
                    form_data.append(k, params[k]);
                }
            }

        }

        const res = axios.post(`${this.__base_url}${url}`, form_data, {
            onDownloadProgress: function (progress_event) {
                LoadingFunctions.setLoading(true, progress_event.loaded / progress_event.total * 100);
                if (progress_event.loaded === progress_event.total) {
                    LoadingFunctions.setLoading(false, 0);
                }
            }
        });

        return res;
    }

    delete<ResponseType>(url: string): Promise<AxiosPromise<ResponseType>> {
        return axios.delete(`${this.__base_url}${url}`);
    }

    put<ResponseType>(url: string, params: Object): Promise<AxiosPromise<ResponseType>> {
        return axios.put(`${this.__base_url}${url}`, params);
    }
}

export default new Fetch()