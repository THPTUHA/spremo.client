import store from '../store';
import * as DrawActions  from './slice';
import { ActionCreators } from "redux-undo";
import Fetch from '../../services/Fetch';
import { BLOG_TYPES, Code } from '../../Constants';
import { Toast } from '../../services/Toast';

const add = (shape:any,storex = store)=>{
    storex.dispatch(DrawActions.save(shape));
}

const undo = (storex = store)=>{
    storex.dispatch(ActionCreators.undo());
}

const redo = (storex = store)=>{
    storex.dispatch(ActionCreators.redo());
}

const init = async(blog: any,storex = store)=>{
    storex.dispatch(DrawActions.init({
        shapes: blog.data.shapes,
        id: blog.id
    }))
}

const create = async(emotion_id: number,storex = store)=>{
    try {
        const res = await Fetch.postJsonWithAccessToken<{code: number,message: string,blog:any}>("/api/me/blog.create",{
            type: BLOG_TYPES.DRAW,
            emotion_id: emotion_id
        });
        
        if(res.data){
            const {code,message, blog} = res.data;
            console.log("DRAW CREATE",blog);
            if(code == Code.SUCCESS){
                storex.dispatch(DrawActions.init({
                    shapes: blog.data.shapes,
                    id: blog.id
                }))
                return blog
            }else{
                Toast.error(message);
            }
        }
    } catch (error) {
        console.log(error);
        Toast.error("ERROR!!");
    }
    return  {};
}

const update =  async(draw_id: number, shapes: any,url:string,status: number, storex = store) =>{
    try {
        const res = await Fetch.postWithAccessToken<{code: number,message: string}>("/api/me/blog.update",{
            id: draw_id,
            data: JSON.stringify(shapes),
            url: url,
            type: BLOG_TYPES.DRAW,
            status: status
        });
        if(res.data){
            const {code,message} = res.data;
            if(code == Code.SUCCESS){
                storex.dispatch(DrawActions.saveServer())
            }else{
                Toast.error(message);
            }
        }
    } catch (error) {
        console.log(error);
        Toast.error("ERROR!!");
    }
}


const destroy =  async(draw_id: number, shapes: any, storex = store) =>{
    try {
        const res = await Fetch.postWithAccessToken<{code: number,message: string}>("/api/draw/delete",{
            id: draw_id,
        });

        if(res.data){
            const {code,message} = res.data;
            if(code == Code.SUCCESS){
                Toast.success(message);
            }else{
                Toast.error(message);
            }
        }
    } catch (error) {
        console.log(error);
        Toast.error("ERROR!!");
    }
}

export const DrawFunctions = {
    add,
    undo,
    redo,
    create,
    update,
    init,
    destroy
}