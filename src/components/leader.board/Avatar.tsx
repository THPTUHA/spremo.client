import { useMemo } from "react";
import { Link } from "react-router-dom";
import Constants from "../../Constants";
import UI from "../../services/UI";
import { AvatarProps } from "../../store/interface";

const Avatar = ({ name, img, link, sub_name, size }: AvatarProps) => {

    const real_size = useMemo(() => {
        return size ? size : 32;
    }, [size]);

    const style: any = useMemo(() => {
        return {
            height: real_size, width: real_size, maxHeight: real_size, minWith: real_size, minHeight: real_size, minWidth: real_size
        };
    }, [real_size])

    return (
        <Link to={link} >
            <div style={{ ...style }} className={`${link ? "cursor-pointer" : ""} rounded-full flex justify-center items-center border-2 overflow-hidden`} >
                {
                    img ? (<img style={{ ...style }} src={Constants.IMAGE_URL + img}></img>) : (
                        <div style={{ backgroundColor: UI.getColorByString(sub_name ? sub_name : name), ...style }}
                            className="w-9 h-9 rounded-full bg-cover bg-center flex items-center justify-center px-2"
                        >
                            <span className="text-white font-medium text-xl">{name.slice(0, 2)}</span>
                        </div>)
                }
            </div>
        </Link>
    )
};

export default Avatar;