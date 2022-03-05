import Constants from '../../Constants';
import Link from 'next/link';
import { useMemo } from 'react';
import { Helper } from '../../services/Helper';
import UI from '../../services/UI';
import { RawTeamChallenge } from '../../store/types';

interface Props {
    team: RawTeamChallenge,
    size?: number
}

const AvatarTeam = ({ team, size }: Props) => {

    const real_size = useMemo(() => {
        return size ? size : 32;
    }, [size]);

    const style: any = useMemo(() => {
        return {
            height: real_size, width: real_size, maxHeight: real_size, minWith: real_size, minHeight: real_size, minWidth: real_size
        };
    }, [real_size])


    return (
        // <Link href={`/profile/${Helper.generateCode(team.username ? team.username : "")}/${team.id}`} >
            <div style={{ ...style }} className="rounded-full flex justify-center items-center border-2 overflow-hidden" >
                {
                    !!(team?.avatar) ? (<img style={{ ...style }} src={Constants.IMAGE_URL + team.avatar}></img>) : (
                        <div style={{ backgroundColor: UI.getColorByString(team.name), ...style }}
                            className="w-9 h-9 rounded-full bg-cover bg-center flex items-center justify-center px-2"
                        >
                            <span className="text-white font-medium text-xl">{team.name.slice(0, 2)}</span>
                        </div>)
                }
            </div>
        // </Link>
    )
};


export default AvatarTeam;