import { useEffect, useRef, useState } from "react";
import {  RegularPolygon, Transformer } from "react-konva";
import { TriangleProps } from "../../../store/types";

const TriangleShape = ({ shape_props, is_selected, onSelect, onChange }:{shape_props: TriangleProps,is_selected: boolean,onSelect:()=>void,onChange:(attr: TriangleProps)=>void}) => {
    const shape_ref = useRef(null);
    const tr_ref = useRef(null);
    const [is_drag, setIsDrag] = useState(false);
    
    useEffect(() => {
      if (is_selected && tr_ref.current) {
        (tr_ref.current as any).nodes([shape_ref.current]);
        (tr_ref.current as any).getLayer().batchDraw();
        setIsDrag(true);
      }else{
        setIsDrag(false);
      }
    }, [is_selected]);
    
    const handleTranformer = () => {
        const node = shape_ref.current as any;
        if(node){
            const scale = node.scaleX();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
                ...shape_props,
                rotation: Math.round(node.attrs.rotation*100)/100,
                x: node.x(),
                y: node.y(),
                radius: Math.max(10, shape_props.radius * scale)
            });
        }
    }

    return (
        <>
            <RegularPolygon
                onClick={onSelect}
                onTap={onSelect}
                ref={shape_ref}
                {...shape_props}
                draggable = {is_drag}
                onDragEnd={(e) => {
                    if(!is_drag) return;
                    onChange({
                    ...shape_props,
                    x: e.target.x(),
                    y: e.target.y(),
                    });
                }}
                onTransformEnd={handleTranformer}
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

 export default TriangleShape;