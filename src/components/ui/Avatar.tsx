import Constants from '../../Constants';
import Link from 'next/link';
import { useMemo } from 'react';
import { Helper } from '../../services/Helper';
import UI from '../../services/UI';
import { RawUser } from '../../store/types';

interface Props {
    user: RawUser,
    size?: number
}

const Avatar = ({ user, size }: Props) => {

    const real_size = useMemo(() => {
        return size ? size : 32;
    }, [size]);

    const style: any = useMemo(() => {
        return {
            height: real_size, width: real_size, maxHeight: real_size, minWith: real_size, minHeight: real_size, minWidth: real_size
        };
    }, [real_size])


    return (
        <Link href={`/profile/${Helper.generateCode(user.username ? user.username : "")}/${user.id}`} >
            <div style={{ ...style }} className="rounded-full cursor-pointer flex justify-center items-center border-2 overflow-hidden" >
                {
                    !!(user?.avatar) ? (<img style={{ ...style }} src={Constants.IMAGE_URL + user.avatar}></img>) : (
                        <div style={{ backgroundColor: UI.getColorByString(user.username), ...style }}
                            className="w-9 h-9 rounded-full bg-cover bg-center flex items-center justify-center px-2"
                        >
                            <span className="text-white font-medium text-xl">{user.fullname.slice(0, 2)}</span>
                        </div>)
                }
            </div>
        </Link>
    )
};


export default Avatar;