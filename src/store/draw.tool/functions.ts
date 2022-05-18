import { SCALES, SHAPE_STROKE_WIDTH_DEFAULT, TOOLS } from '../../Constants';
import { DrawTool } from '../../interface';
import store from '../store';
import * as DrawToolActions  from './slice';

const setTool = (tool: DrawTool,storex = store)=>{
    if(tool.id == TOOLS.ZOOM.id && tool.option.next){
        for(let i = 0 ;i < SCALES.length ;++i){
            if(SCALES[i] == tool.option.scale){
                tool.option.scale = SCALES[(i+1)%SCALES.length];
                break;
            }
        }
    }
    storex.dispatch(DrawToolActions.changeTool(tool));
}

const setColor = (color: string, storex = store) =>{
    storex.dispatch(DrawToolActions.changeColor(color));
}

export const DrawToolFunctions = {
    setTool,
    setColor
}