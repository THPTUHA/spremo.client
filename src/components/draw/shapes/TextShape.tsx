import { useEffect, useRef, useState } from "react";
import { Text, Transformer } from "react-konva";
import { TextProps } from "../../../interface";

const TextShape = ({ shape_props, is_selected, onSelect, onChange ,handleEditText}:{shape_props: TextProps,is_selected: boolean,onSelect:()=>void,onChange:(attr: TextProps)=>void,handleEditText:()=>void}) => {
    const shape_ref = useRef(null);
    const tr_ref = useRef(null);
    const [is_drag, setIsDrad] = useState(false);
    
    useEffect(() => {
      if (is_selected && tr_ref.current) {
        (tr_ref.current as any).nodes([shape_ref.current]);
        (tr_ref.current as any).getLayer().batchDraw();
        setIsDrad(true);
      }else{
        setIsDrad(false);
      }
    }, [is_selected]);
    
    const handleTranformer = () => {
        const node = shape_ref.current as any;
        if(node){
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            console.log("Tranfer end", node);
            onChange({
                ...shape_props,
                rotation: Math.round(node.attrs.rotation*100)/100,
                x: Math.round(node.x()*100)/100,
                y: Math.round(node.y()*100)/100,
                width: Math.max(5, node.width() * scaleX),
                height: Math.max(5,node.height() * scaleY),
            });
        }
    }

    return (
        <>
            <Text
                onClick={onSelect}
                onTap={onSelect}
                ref={shape_ref}
                {...shape_props}
                draggable = {is_drag}
                onDragEnd={(e) => {
                    if(!is_drag) return;
                    onChange({
                    ...shape_props,
                    x:e.target.x(),
                    y: e.target.y(),
                    });
                }}
                onTransformEnd={handleTranformer}
                onDblClick={handleEditText}
            />
            {is_selected && (
            <Transformer
                ref={tr_ref}
                boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                }
                return newBox;
                }}
            />
            )}
        </>
    );
 };

 export default TextShape;