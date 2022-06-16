import { useRef, useState } from 'react';
import DrawBoard from '../../components/draw/drawBoard/DrawBoard';
import Tool from '../../components/draw/tools/Tool';
import { KEY_CODE, SHAPES, SHAPE_STROKE_WIDTH_DEFAULT, TOOLS } from '../../Constants';
import { DrawToolFunctions } from '../../store/draw.tool/functions';
import { DrawToolHook } from '../../store/draw.tool/hooks';
import { DrawFunctions } from '../../store/draw/functions';
import { DrawHook } from '../../store/draw/hooks';

const Draw = ()=>{
    const is_ctrl_press = useRef(false);
    const is_shift_press = useRef(false);
    const blog = DrawHook.useBlog();
    const TOOL = DrawToolHook.useTool();

    const handleKeyDown = (key: any)=>{
        if(TOOL.id == TOOLS.SAVE.id) return;
        switch(key.keyCode){
            case KEY_CODE.CTRL:
                is_ctrl_press.current = true;
                break;
            case KEY_CODE.SHIFT:
                is_shift_press.current = true;
                break;
            case KEY_CODE.Z:
                if(is_ctrl_press.current && is_shift_press.current){
                    DrawFunctions.redo();
                }else if(is_ctrl_press.current){
                    DrawFunctions.undo();
                }
                break;
            case KEY_CODE.M:
                if(TOOL.id == TOOLS.TEXT.id && TOOL.option.is_typing){
                    return;
                }
                DrawToolFunctions.setTool({id: TOOLS.SHAPE.id,option:{
                        shape_id:SHAPES.RECTANGLE.id, stroke_width: SHAPE_STROKE_WIDTH_DEFAULT
                }})
                break;
            case KEY_CODE.L:
                if(TOOL.id == TOOLS.TEXT.id && TOOL.option.is_typing){
                    return;
                }
                DrawToolFunctions.setTool({id: TOOLS.SHAPE.id,option:{
                        shape_id:SHAPES.CIRCLE.id, stroke_width: SHAPE_STROKE_WIDTH_DEFAULT
                }})
                break;
            case KEY_CODE.P:
                if(TOOL.id == TOOLS.TEXT.id && TOOL.option.is_typing){
                    return;
                }
                DrawToolFunctions.setTool({id: TOOLS.SHAPE.id,option:{
                        shape_id:SHAPES.TRIANGLE.id, stroke_width: SHAPE_STROKE_WIDTH_DEFAULT
                }})
                break;
            case KEY_CODE.V:
                if(TOOL.id == TOOLS.TEXT.id && TOOL.option.is_typing){
                    return;
                }
                DrawToolFunctions.setTool(TOOLS.SELECT)
                break;
            case KEY_CODE.D:
                if(TOOL.id == TOOLS.TEXT.id && TOOL.option.is_typing){
                    return;
                }
                DrawToolFunctions.setTool(TOOLS.DRAW)
                break;
            case KEY_CODE.F:
                if(TOOL.id == TOOLS.TEXT.id && TOOL.option.is_typing){
                    return;
                }
                DrawToolFunctions.setTool(TOOLS.FILL)
                break;
            case KEY_CODE.H:
                if(TOOL.id == TOOLS.TEXT.id && TOOL.option.is_typing){
                    return;
                }
                DrawToolFunctions.setTool(TOOLS.SHORT_CUT)
                break;
            case KEY_CODE.T:
                if(TOOL.id == TOOLS.TEXT.id && TOOL.option.is_typing){
                    return;
                }
                DrawToolFunctions.setTool(TOOLS.TEXT)
                break;
            case KEY_CODE.SUM:
                if(TOOL.id == TOOLS.TEXT.id && TOOL.option.is_typing){
                    return;
                }
                DrawToolFunctions.setTool(TOOLS.ZOOM)
                break;
            case KEY_CODE.BACK_SPACE:
                if(TOOL.id == TOOLS.TEXT.id && TOOL.option.is_typing){
                    return;
                }
                DrawToolFunctions.setTool(TOOLS.DELETE)
                break;
        }
    }   

    const handleKeyUp = (key: any)=>{
        switch(key.keyCode){
            case KEY_CODE.CTRL:
                is_ctrl_press.current = false;
                break;
            case KEY_CODE.SHIFT:
                is_shift_press.current = false;
                break;
        }
    }
    return (
        <div className='bg-gray-500 text-black' tabIndex={1} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} >
            <Tool/>
            {blog && <DrawBoard blog={blog}/>}
        </div>
    )
}
export default Draw;