import { useState } from "react";
import { AiFillSave, AiOutlineDownload, AiOutlineMenu, AiOutlineZoomIn } from "react-icons/ai";
import { BiRectangle, BiText } from "react-icons/bi";
import { BsCircle, BsPencil, BsQuestionLg, BsSquare, BsThreeDots, BsTriangle } from "react-icons/bs";
import { FaShapes, FaUndoAlt } from "react-icons/fa";
import { FiMove } from "react-icons/fi";
import { IoMdColorFill } from "react-icons/io";
import { RiDeleteBin2Line } from "react-icons/ri";
import Modal from "react-responsive-modal";
import Slider from "react-slick";
import { TOOLS,COLORS,TEXT_FONTS, TEXT_SIZES,SHAPES,SCALES, PUBLIC, PRIVATE, DRAFT } from "../../../Constants";
import { DrawTool } from "../../../interface";
import { DrawToolFunctions  } from "../../../store/draw.tool/functions";
import { DrawToolHook } from "../../../store/draw.tool/hooks";
import { MeHook } from "../../../store/me/hooks";
import { RawBlog } from "../../../store/types";


const ColorTrips = ()=>{
    const color_init = DrawToolHook.useColor();

    const renderSlides = () =>
        COLORS.map((color,index)=>(
            <div onClick={()=>{DrawToolFunctions.setColor(color)}} key={index} className="cursor-pointer my-2">
                <span style={{backgroundColor: color,color:color, borderRadius:50}} className={`border-white box-border shadow-xl hover:border-2 ${color == color_init ?"border-2":"" }`} >Oo</span>
            </div>
    ))
    return (
        <div
            className='bg-gray-400 flex items-center h-10 fixed z-50 rounded-full ml-10 justify-center ' style={{minWidth: 340}}>
            <div  style={{maxWidth: 240}}>
                <Slider
                    dots={false}
                    slidesToShow={8} 
                    slidesToScroll={8}
                    speed = {500}
                >
                    {renderSlides()}
                </Slider>
            </div>
        </div>
    )
}

const Color = ()=>{
    const color = DrawToolHook.useColor();
    return <div className='w-10 h-10 rounded-full border-2 border-white' style={{backgroundColor: color}}/> 
}

const SHAPE_OPTIONS= [
    {...SHAPES.RECTANGLE,icon:<BsSquare className="w-8 h-auto"/>},
    {...SHAPES.CIRCLE,icon:<BsCircle className="w-8 h-auto"/>},
    {...SHAPES.TRIANGLE,icon:<BsTriangle className="w-8 h-auto"/>}
]
const ShapeOption = ({tool}:{tool:DrawTool})=>{
    const selectShape = (shape_id: string)=>{
        DrawToolFunctions.setTool({id: TOOLS.SHAPE.id,option:{
            shape_id: shape_id,
            stroke_width: TOOLS.SHAPE.option.stroke_width
        }})
    }
    return (
        <div className="flex items-center ml-10">
            <div className=" text-lg mr-2">Shape</div>
            {
                SHAPE_OPTIONS.map((shape)=>(
                    <div key={shape.id} onClick={()=>selectShape(shape.id)} className={`ml-5 cursor-pointer ${shape.id == tool.option.shape_id?"text-yellow-500":""}`}>
                        {shape.icon}
                    </div>
                ))
            }
        </div>
    )
}

const TextOption = ({tool}:{tool: DrawTool})=>{
    const handleTextOption = (e: any)=>{
        console.dir(e.target.selectedIndex);
        if(e.target.name == "font"){
            DrawToolFunctions.setTool({id:TOOLS.TEXT.id, option:{
                ...tool.option,
                font: e.target.value
            }})
        }else if(e.target.name == "size"){
            DrawToolFunctions.setTool({id:TOOLS.TEXT.id, option:{
                ...tool.option,
                size: parseInt(e.target.value)
            }})
        }
    }
    return (
        <div className="flex">
             <select defaultValue={tool.option.font} className=" cursor-pointer outline-none focus:outline-none text-lg ml-5 text-gray-500 hover:text-gray-900 transition-all" onChange={handleTextOption} name="font">
                {TEXT_FONTS.map((value, index) => (
                    <option key={index} value={value} > {value}</option>
                ))}
            </select>
            <select defaultValue={tool.option.size} className=" cursor-pointer outline-none focus:outline-none text-lg ml-5 text-gray-500 hover:text-gray-900 transition-all" onChange={handleTextOption} name="size">
                {TEXT_SIZES.map((value, index) => (
                    <option key={index} value={value} > {value}</option>
                ))}
            </select>
        </div>
    )
}

const ZoomOption = ({tool}:{tool: DrawTool})=>{
    const selectScale = (scale: number)=>{
        DrawToolFunctions.setTool({id: TOOLS.ZOOM.id, option:{scale: scale}});
    }
    return (
        <div className="flex items-center ml-10">
            {
                SCALES.map((scale,index)=>(
                    <div key={index} onClick={()=>selectScale(scale)} className={`ml-5 cursor-pointer ${scale == tool.option.scale?"text-yellow-500":""}`}>
                        {scale}
                    </div>
                ))
            }
        </div>
    )
}
// const Menu = ()=>{

//     return (
//         <div className="z-50 flex ml-1">
//             <div><AiOutlineMenu className="w-8 h-auto"/></div>
//         </div>
//     )
// }
const ToolMove = {...TOOLS.SELECT, icon: <FiMove className='w-6 h-auto'/>};

const ToolDraw = [
    {...TOOLS.DRAW ,icon: <BsPencil className='w-6 h-auto'/> },
    {...TOOLS.TEXT, icon: <BiText className='w-6 h-auto'/> },
    {...TOOLS.FILL, icon: <IoMdColorFill className='w-6 h-auto'/>},
    {...TOOLS.SHAPE, icon: <FaShapes className='w-6 h-auto'/>},
]

const ToolColor = {...TOOLS.COLOR,icon: <Color/>};

const ToolOther = [
    {...TOOLS.ZOOM, icon: <AiOutlineZoomIn className='w-6 h-auto'/> },
    {...TOOLS.SHORT_CUT, icon: <BsQuestionLg className='w-6 h-auto'/> },
    {...TOOLS.SAVE, icon: <AiFillSave className='w-6 h-auto'/>},
    {...TOOLS.DOWLOAD, icon: <AiOutlineDownload className='w-6 h-auto'/>},
]

const PenRange = ({tool}:{tool: DrawTool})=>{
    const handlePenSize = (e: any)=>{
        DrawToolFunctions.setTool({id: TOOLS.DRAW.id, option:{
            stroke_width: parseInt(e.target.value)
        }})
    }
    
    return (
        <div className="flex">
            <div className="relative slider-container">
                <span className="bar cursor-pointer shadow absolute left-0 top-3 w-full h-2 rounded-full overflow-hidden bg-primary bg-opacity-30">
                    <span className="fill block w-0 h-full bg-primary"></span>
                </span>
                <input id="slider" type="range" min={5} max={50} value={tool.option.stroke_width} onChange={handlePenSize}
                    className="slider cursor-pointer relative appearance-none w-full h-1 rounded-full outline-none bg-transparent" />
            </div>
            <span className={`rounded-full bg-red-500 ml-5`} style={{width: tool.option.stroke_width, height:tool.option.stroke_width}}></span>
        </div>
    )
}

const Tool = ()=>{
    const me = MeHook.useMe();
    const TOOL = DrawToolHook.useTool();
    const [is_open_color_trip,setOpenColorTrip] = useState(false);
    const closeModalShortCut = ()=>{
        DrawToolFunctions.setTool(TOOLS.SELECT);
    }
    return (
        <>  
            <div className="flex fixed z-50 ml-10 mt-[50px]">
                <div className="ml-5 mt-10">
                    {
                        TOOL.id == TOOLS.SHAPE.id &&  <ShapeOption tool={TOOL}/>
                    }
                    {
                        TOOL.id == TOOLS.DRAW.id  && <PenRange tool={TOOL}/>
                    }
                    {
                        TOOL.id == TOOLS.TEXT.id  && <TextOption tool={TOOL}/>
                    }
                    {
                        TOOL.id == TOOLS.ZOOM.id  && <ZoomOption tool={TOOL}/>
                    }
                </div>
            </div>
            <div className='flex flex-col fixed z-50 ml-10 mt-[100px]'>
                <div 
                    onClick={()=>DrawToolFunctions.setTool({id:ToolMove.id, option:[]})}
                    className={`cursor-pointer rounded-full w-10 h-10 flex items-center justify-center mb-5 ${TOOL.id == ToolMove.id ? "bg-blue-500":"bg-white"}`}>
                    <div>{ToolMove.icon}</div>
                </div>
               {
                   ToolDraw.map((tool)=>(
                       <div key={tool.id} 
                            onClick={()=>DrawToolFunctions.setTool({id:tool.id, option:tool.option})}
                            className={`cursor-pointer rounded-full w-10 h-10 flex items-center justify-center mb-2 ${TOOL.id == tool.id ? "bg-blue-500":"bg-white"}`}>
                           <div>{tool.icon}</div>
                       </div>
                   ))
               }
               <div className="cursor-pointer flex mb-5 mt-5"  onMouseLeave={()=>{setOpenColorTrip(false)}}>
                    <div 
                        onMouseOver = {()=>{setOpenColorTrip(true)} }
                        className={` rounded-full w-10 h-10 items-center justify-center ${TOOL.id == ToolColor.id ? "bg-blue-500":"bg-white"}`}>
                        <div>{ToolColor.icon}</div>
                    </div>
                    { is_open_color_trip && <ColorTrips/>}
               </div>
                {
                   ToolOther.map((tool)=>(
                       <div key={tool.id} 
                            onClick={()=>DrawToolFunctions.setTool({id:tool.id, option:tool.option})}
                            className={`cursor-pointer rounded-full w-10 h-10 flex items-center justify-center mb-2 ${TOOL.id == tool.id ? "bg-blue-500":"bg-white"}`}>
                           <div >{tool.icon}</div>
                       </div>
                   ))
                }
            </div>
            <Modal
                classNames={{
                    modal: "rounded-lg overflow-x-hidden w-2/5 relative"
                }}

                onClose={closeModalShortCut} open={TOOL.id == TOOLS.SHORT_CUT.id}>
                <>
                    {TOOL.id == TOOLS.SHORT_CUT.id && (
                    <div >
                        <div>
                            <span className="font-medium text-white bg-green-500 py-2">Undo</span>
                            <span className="font-medium text-white bg-green-500 py-2">Ctr + Z</span>
                        </div>
                        <div>
                            <span>Redo</span>
                            <span>Shift + Ctr + Z</span>
                        </div>
                        <div>
                            <span>Select</span>
                            <span>V</span>
                        </div>
                        <div>
                            <span>Draw</span>
                            <span>D</span>
                        </div>
                        <div>
                            <span>Text</span>
                            <span>T</span>
                        </div>
                        <div>
                            <span>Rectangle</span>
                            <span>R</span>
                        </div>
                        <div>
                            <span>Circle</span>
                            <span>C</span>
                        </div>
                        <div>
                            <span>Triangle</span>
                            <span>T</span>
                        </div>
                        <div>
                            <span>Fill</span>
                            <span>F</span>
                        </div>
                        <div>
                            <span>Zoom</span>
                            <span>+</span>
                        </div>
                    </div>
                    )}
                </>
            </Modal>
        </>
    )
}

export default Tool;