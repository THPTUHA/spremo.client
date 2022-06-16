import { KonvaEventObject } from 'konva/lib/Node';
import { KeyboardEventHandler, useEffect, useRef, useState,useLayoutEffect, MouseEventHandler } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line ,Transformer} from 'react-konva';
import { Link } from 'react-router-dom';
import { BLOG_TYPES, Code, COLORS, DRAFT, KEY_CODE,  ROLES,  SHAPES,  TOOLS } from '../../../Constants';
import { DrawToolFunctions } from '../../../store/draw.tool/functions';
import { DrawToolHook } from '../../../store/draw.tool/hooks';
import CircleShape from '../shapes/CircleShape';
import LineShape from '../shapes/LineShape';
import RectangleShape from '../shapes/RectangleShape';
import TextShape from '../shapes/TextShape';
import TriangleShape from '../shapes/TriangleShape';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { DrawHook } from '../../../store/draw/hooks';
import { DrawFunctions } from '../../../store/draw/functions';
import { useAsync } from 'react-use';
import Fetch from '../../../services/Fetch';
import { Toast } from '../../../services/Toast';
import { MeHook } from '../../../store/me/hooks';
import { RawBlog, RawDraw, TextProps } from '../../../store/types';
import Modal from 'react-responsive-modal';
import TagEdit from '../../blog/TagEdit';


const getCursor = (tool_id: number)=>{
    return ((tool_id == TOOLS.DRAW.id)||(tool_id== TOOLS.SHAPE.id)||(tool_id== TOOLS.FILL.id) )? 'crosshair'
            :(tool_id == TOOLS.TEXT.id)?"text":""
}

function downloadURI(uri: string, name: string) {
    if(!uri) return;
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function dataURLtoFile(dataurl:any, filename: string) {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}

function imageDataToBase64(img_data: ImageData){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if(ctx){
        canvas.width = img_data.width;
        canvas.height = img_data.height;
        ctx.putImageData(img_data, 0, 0);
        return canvas.toDataURL();
    }
    return "";
}

let scale = 1;

const SCROLL_X = 250;
const SCROLL_Y= 400;

const DRAW_X = 450;
const DRAW_Y = 500;

const DrawBoard = ({blog}:{blog: RawBlog})=>{
    const me = MeHook.useMe();
    const TOOL = DrawToolHook.useTool();
    const COLOR = DrawToolHook.useColor();
    const SHAPE_STORES = DrawHook.useShape();

    const [shapes,setShapes] = useState<any[]>([...SHAPE_STORES]);
    const [image_url, setImageUrl] = useState("");
    const [description, setDescription]= useState((blog.data as RawDraw).description);
    const stage_ref = useRef<any>(null);
    const layer_ref = useRef<any>(null);
    const is_drawing = useRef(false);
    const typing = useRef({
        key: 0,
        position: 0
    });
    const text_ref = useRef<any>(null);
    
    const state_curr = useRef<any>({
        id : 0,
        shape: {},
        shapes:[]
    });

    const [selected_shape_key, setSelectShapeKey] = useState(-1);

    const handleSelect = (id: number, is_typing?:boolean )=>{
        if(TOOL.id == TOOLS.SELECT.id ||is_typing){
            setSelectShapeKey(id);
        }
    }
    const handleExport = ()=>{
        if(layer_ref.current){
            //@ts-ignore
            const img_data = layer_ref.current.canvas.context.getImageData(DRAW_X*scale, DRAW_Y*scale, 1000, 500);
            downloadURI(imageDataToBase64(img_data), 'spremo.png');
            DrawToolFunctions.setTool(TOOLS.SELECT);
        }
    }
    const saveDrawImg = async()=>{
        if(!image_url){
            Toast.error("Image empty!!");
            return "";
        }
        const image = await dataURLtoFile(image_url,`spremo_draw${blog.id}`);
        try {
            const res = await Fetch.postWithAccessToken<{code:number,message:string,url:string}>("/api/upload/img",{
                image: image,
                name: `spremo_draw_${blog.id}` 
            });
            if(res.data){
                const {code, message, url} = res.data;
                if(res.data.code == Code.SUCCESS){
                    return url;
                }
                Toast.error(message);
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
        return "";
    }

    const handleSave = async(external: any)=>{
        const url = await saveDrawImg();
        let data = {
            data: JSON.stringify({
                shapes: SHAPE_STORES,
                url: url,
                description: description,
            }),
            id: blog.id,
            type: BLOG_TYPES.DRAW
        }

        if(external){
            data = {
                ...data,
                ...external
            }
        }
        await DrawFunctions.update(data);
        DrawToolFunctions.setTool(TOOLS.SELECT);
    }
    useEffect(()=>{
        if(stage_ref.current && layer_ref.current){
             //@ts-ignore
            layer_ref.current.setAttrs({backgroundColor:"white"});
        }
    },[]);

    const scroll = useRef<any>(null);

    useLayoutEffect(() => {
        scroll.current.scrollLeft = SCROLL_X;
        scroll.current.scrollTop = SCROLL_Y;
    },[]);

    useAsync(async()=>{
        if(TOOL.id == TOOLS.SAVE.id){
            const img_data = layer_ref.current.canvas.context.getImageData(DRAW_X*scale, DRAW_Y*scale, 1000, 500);
            const image_url = await imageDataToBase64(img_data);
            setImageUrl(image_url);
        }
    },[TOOL])

    useLayoutEffect(()=>{
        if(TOOL.id == TOOLS.DOWLOAD.id){
            handleExport();
        }

        if(TOOL.id == TOOLS.DELETE.id){
            if(selected_shape_key == -1) return;
            saveState(false, shapes.filter(shape => shape.key != selected_shape_key));
            DrawToolFunctions.setTool(TOOLS.SELECT);
            return;
        }

        if(TOOL.id == TOOLS.ZOOM.id){
            scale = TOOL.option.scale;
            if(layer_ref.current){
                layer_ref.current.scale({ x: scale, y: scale });
            }
            return;
        }
        if(TOOL.id != TOOLS.TEXT.id && typing.current.key){
            // closeEditText();
            setSelectShapeKey(-1);
        }
        if(TOOL.id == TOOLS.ZOOM.id){
            scale = TOOL.option.scale;
            setSelectShapeKey(-1);
        }
        
    },[TOOL])

    useLayoutEffect(()=>{
        setShapes([...SHAPE_STORES]);
    },[SHAPE_STORES])

    useLayoutEffect(()=>{
        const body = document.getElementsByTagName("body");
        body[0].style.overflow = "hidden";
        return ()=>{
            body[0].style.overflow = "";
        }
    },[])


    const saveState = (is_fill?: boolean , shapes_alt?:any)=>{
        if((state_curr.current.id == "-1" && !shapes_alt) || (TOOL.id == TOOLS.FILL.id && !is_fill)) return;
        if(state_curr.current.shape && !shapes_alt){
            if(!state_curr.current.shape.width && ! state_curr.current.shape.height && !state_curr.current.shape.radius && state_curr.current.id != SHAPES.SHAPE_DRAW.id) {
                return;
            }
            if(state_curr.current.id == SHAPES.SHAPE_DRAW.id && state_curr.current.shape.points.length < 3) {
                return;
            }
        }

        DrawFunctions.add(shapes_alt? shapes_alt: shapes);
        state_curr.current.id = "-1";
    }


    const setStateCurrent = (id: string, shape: any, shapes: any)=>{
        state_curr.current.id = id;
        state_curr.current.shape = shape;
        state_curr.current.shapes = shapes;
    }

    const editText = (text: TextProps,init?:boolean)=>{
        text_ref.current.style.top = (text.y * scale) + "px";
        text_ref.current.style.left = (text.x * scale) + "px";
        // text_ref.current.style.top = (text.y) + "px";
        // text_ref.current.style.left = (text.x) + "px";
        text_ref.current.style.fontSize = text.fontSize + "px";
        text_ref.current.style.fontFamily = text.fontFamily;
        text_ref.current.style.color = text.fill;
        // text_ref.current.style.transform = 'rotate('+text.rotation+'deg)'; 
        text_ref.current.innerText = text.text;
        text.text = "";
        if(init){
            text_ref.current.classList.add("input-cursor");
            text_ref.current.classList.remove("text-box");
        }else{
            text_ref.current.classList.remove("input-cursor");
            text_ref.current.classList.add("text-box");
            text_ref.current.focus();
            DrawToolFunctions.setTool({id: TOOLS.TEXT.id, option:{
                font: text.fontFamily,
                size: text.fontSize,
                is_typing: true
            }})
            // setSelectShapeId(text.key)
        }
        text_ref.current.style.display = "";
      }
    
    const handleKeyDown = (e: any)=>{
        if(TOOL.id == TOOLS.TEXT.id && TOOL.option.is_typing){
            if(e.keyCode == KEY_CODE.SHIFT) return;
            const text = state_curr.current.shape;
            text.width = text_ref.current.clientWidth + text.fontSize;
            text.height = text_ref.current.clientHeight + text.fontSize ;
            if(text_ref.current.classList.contains("input-cursor")){
                text_ref.current.classList.remove("input-cursor");
                text_ref.current.classList.add("text-box");
                text_ref.current.focus();
                setSelectShapeKey(text.key);
            }else{
                if(e.keyCode == KEY_CODE.ENTER){
                    // text.width -= 10;
                    text.height += text.fontSize;
                }
                setShapes(shapes.concat());
            }
            return;
        }
    }
    const closeEditText = ()=>{
        const text = state_curr.current.shape;
        text.text = text_ref.current.innerText;
        text_ref.current.innerText = "";
        text_ref.current.style.display = "none";
    }

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        
        if(!e  || !e.target || !e.target.getStage()|| (
            TOOL.id != TOOLS.SHAPE.id && TOOL.id != TOOLS.DRAW.id && TOOL.id != TOOLS.TEXT.id
        )) return;
        if(TOOL.id == TOOLS.TEXT.id){
            if(e.target.className == "Text" ){
                return;
            }else if(TOOL.option.is_typing){
                // onClick out form text reset form text to canvas
                closeEditText();
                DrawToolFunctions.setTool({id: TOOLS.SELECT.id,option:[]});
                return;
            }
        }
        is_drawing.current = true;
        const pos = e.target.getStage()?.getPointerPosition();
        let shape ;
        if(pos){
            pos.x = pos.x / scale;
            pos.y = pos.y /scale;
            const key =  shapes[0].key + 1;
            shapes[0] = {key:key}
            switch(TOOL.id){
                case TOOLS.SHAPE.id:
                    switch(TOOL.option.shape_id){
                        case SHAPES.RECTANGLE.id:
                            shape = {
                                ...pos,
                                id: TOOL.option.shape_id,
                                key: key,
                                width: 0,
                                height: 0,
                                fill: "",
                                stroke: COLOR,
                                strokeWidth: TOOL.option.stroke_width,
                                rotation: 0,
                            }
                            break;
                        case SHAPES.CIRCLE.id:
                            shape = {
                                ...pos,
                                id: TOOL.option.shape_id,
                                radius: 0, 
                                fill: "",
                                stroke: COLOR,
                                strokeWidth: TOOL.option.stroke_width,
                                rotation: 0,
                                key: key
                            }
                            break;
                        case SHAPES.TRIANGLE.id:
                            shape = {
                                ...pos,
                                id: TOOL.option.shape_id,
                                radius: 0, 
                                fill: "",
                                stroke: COLOR,
                                strokeWidth: TOOL.option.stroke_width,
                                rotation: 0,
                                sides: 3,
                                key: key
                            }
                            break;
                    }
                    if(shape){
                        setStateCurrent(TOOL.option.shape_id,shape,shapes.concat());
                        shapes.push(shape);
                    }
                    break;

                case TOOLS.DRAW.id:
                    shape = {
                        x: 0,
                        y: 0 ,
                        id: SHAPES.SHAPE_DRAW.id,
                        points: [pos.x, pos.y],
                        stroke: COLOR,
                        rotation: 0,
                        LineCap:"round",
                        strokeWidth: TOOL.option.stroke_width,
                        scaleX:1,
                        scaleY: 1,
                        key: key
                    }
                    setStateCurrent(shape.id,shape,shapes.concat());
                    shapes.push(shape);
                    break;
                case TOOLS.TEXT.id:
                    shape = {
                        ...pos,
                        id: SHAPES.TEXT.id,
                        fill: COLOR,
                        rotation: 0,
                        text: "",
                        fontSize: TOOL.option.size,
                        fontFamily: TOOL.option.font,
                        width: 0,
                        height:0,
                        key: key,
                    }
                    setStateCurrent(shape.id,shape,shapes.concat());
                    is_drawing.current = false;
                    shapes.push(shape);
                    editText(shape,true);
                    DrawToolFunctions.setTool({id: TOOL.id,option:{
                        ...TOOL.option,
                        is_typing: true
                    }})
                    // text_ref.current.focus();
        }}
      };

      const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (!is_drawing.current) return;
        const stage = e.target.getStage();
        if(stage){
            const point = stage.getPointerPosition();
            
            if(point){
                point.x = point.x /scale;
                point.y = point.y /scale;
                const shape = shapes[shapes.length - 1];
                switch(TOOL.id){
                    case TOOLS.SHAPE.id:
                        if(!shape)return;
                        const dx = point.x - shape.x;
                        const dy = point.y - shape.y;
                        switch(TOOL.option.shape_id){
                            case SHAPES.RECTANGLE.id:
                                shape.width = point.x - shape.x; 
                                shape.height = point.y - shape.y;
                                break;
                            case SHAPES.CIRCLE.id:
                                shape.radius = Math.sqrt(dx*dx + dy*dy);
                                break;
                            case SHAPES.TRIANGLE.id:
                                shape.radius = Math.sqrt(dx*dx + dy*dy);;
                                break;
                        }
                        setShapes(shapes.concat());
                        break;
                    case TOOLS.DRAW.id:
                        if(!shape)return;
                        shape.points = shape.points.concat(point.x,point.y);
                        setShapes(shapes.concat());
                        break;
                }
            }
        }
    };
    const handleMouseUp = () => {
        is_drawing.current = false;
        if(TOOL.id == TOOLS.ZOOM.id) return;
        if(TOOL.id == TOOLS.DRAW.id){
            state_curr.current.shape.tension= 0.6;
        }
        saveState();
    };

    const handleKeyUp = (e:any) => {
        // if(e.keyCode == KEY_CODE.CTRL){
        //     is_ctrl_down.current = false;
        // }
    }

    const handleZoom = (e: any)=>{
        if(TOOL.id != TOOLS.ZOOM.id) return ;
        e.evt.preventDefault();
        DrawToolFunctions.setTool({id:TOOLS.ZOOM.id, option:{next:true, scale:TOOL.option.scale}})
    }

    return (
        <div tabIndex={1} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} >
        <PerfectScrollbar style={{height: window.innerHeight, width:window.innerWidth }}
            containerRef={(ref) => {scroll.current = ref;}}
        >
        <span contentEditable={true} className="absolute z-30 text-box"
            ref={text_ref} 
            style={{display:"none"}}
            >
        </span>
        <Stage ref={stage_ref} width={2000} height={1500} 
            onMouseDown = {handleMouseDown}
            onMouseMove = {handleMouseMove}
            onMouseUp = {handleMouseUp}
            onClick = {handleZoom}
            style = {{cursor: getCursor(TOOL.id),zIndex:50}}
        >
            <Layer ref={layer_ref}>
            <Rect
                width={2000}
                height={1500}
                fill="rgb(0,0,0)"
                onClick={()=>{setSelectShapeKey(-1)}}
            />
            <Rect
                x={450}
                y={500}
                width={1000}
                height={500}
                fill="white"
                onClick={()=>{setSelectShapeKey(-1)}}
            />
            {
                shapes.map((shape,index)=>{
                    const props = {
                        key: shape.key,
                        shape_props : shape,
                        is_selected: (shape.key === selected_shape_key),
                        onSelect:() => {
                            if(TOOL.id == TOOLS.TEXT.id && shape.id == SHAPES.TEXT.id){
                                shapes[index] = {
                                    ...shape,
                                }
                                shape = shapes[index];
                                setStateCurrent(shape.id,shape,shapes.concat());
                                handleSelect(shape.key, true);
                                editText(shape);
                                return;
                            }

                            if(TOOL.id == TOOLS.FILL.id){
                                setStateCurrent(shape.id,shape, shapes.concat());
                                shapes[index] = {
                                    ...shape,
                                    fill: COLOR
                                }
                                saveState(true);
                            }else{
                                handleSelect(shape.key);
                            }
                        },
                        onChange:(new_attrs: any) => {
                            shapes[index]= new_attrs;
                            setStateCurrent(shape.id,shape, shapes.concat());
                            saveState();
                        }
                    }
                        switch(shape.id){
                        case SHAPES.RECTANGLE.id:
                                return (
                                <RectangleShape {...props}/>
                            )
                        case SHAPES.CIRCLE.id:
                            return (
                                <CircleShape {...props}/>
                            )
                        case SHAPES.TRIANGLE.id:
                            return (
                                <TriangleShape {...props}/>
                            )
                        case SHAPES.SHAPE_DRAW.id:
                            return (
                                <LineShape {...props}/>
                            )
                        case SHAPES.TEXT.id:
                            return (
                                <TextShape {...props} handleEditText = {()=>{
                                    shapes[index] = {
                                        ...shape,
                                    }
                                    shape = shapes[index];
                                    setStateCurrent(shape.id,shape,shapes.concat())
                                    editText(shape);
                                }}/>
                            )
                    }
                })
            }
            </Layer>
        </Stage>
        </PerfectScrollbar>

        <Modal
            classNames={{
                modal: "rounded-lg overflow-x-hidden w-2/5 relative"
            }}
            center
            styles={{
                modal:{
                    backgroundColor: "black"
                }
            }}
            onClose={()=>{}} open={TOOL.id == TOOLS.SAVE.id}>
               <div >
                    <input type="text" placeholder='Description...' value={description}
                            className='w-full outline-none px-2 py-2 mb-3 bg-black text-white'
                            onChange={(e)=>{setDescription(e.target.value)}}
                    />
                    {image_url && <img src={image_url}/>}
                    <TagEdit blog = {blog}
                        handleCancelBlog = {()=>{DrawToolFunctions.setTool(TOOLS.SELECT);}}
                        handleSaveBlog = {handleSave}
                        is_edit={true}
                    />
                </div>
        </Modal>
        </div>
    )
}
export default DrawBoard;
