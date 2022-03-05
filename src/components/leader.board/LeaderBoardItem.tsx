import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { LeaderBoardItemProps } from "../../store/interface";
import Avatar from "./Avatar";

const colorRank = (rank: number) => {
    return rank == 1 ? "text-yellow-500" : rank == 2 ? "text-gray-500" :
        rank == 3 ? "text-orange-500" : "text-black";
}

const LeaderBoardItem = ({ rank, rank_status, is_pos, min_width, avatar, extensions }: LeaderBoardItemProps) => {
    return (
        <div className='relative w-full py-1 hover:bg-gray-100 rounded-md' style={{ minWidth: min_width ? min_width : 480 }}>
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center">
                    {
                        is_pos &&
                        <div className={`mr-2 font-medium font-medium ${colorRank(rank)} `}>
                            {
                                rank_status > 0 && <div className="flex flex-col items-center justify-start">
                                    <div className="text-green-500 -mb-1"><GoTriangleUp/></div>
                                    <div className="mb-2">{rank}</div>
                                </div>
                            }
                            {
                                rank_status == 0 && <div className="ml-1 mr-1 py-2">{rank}</div>
                            }
                            {
                                rank_status < 0 && <div className="flex flex-col items-center justify-start">
                                    <div className="mt-1">{rank}</div>
                                    <div className="text-red-500 -mt-1"><GoTriangleDown/></div>
                                </div>
                            }
                        </div>
                    }

                    <Avatar {...avatar} />
                    <div className="flex flex-col ml-2">
                        <div className='text-sm font-medium text-gray-800'>{avatar.name}</div>
                    </div>
                </div>
                <div className="flex items-center">
                    {
                        extensions.map((e, index) => (
                            <div key={index} className="font-medium mr-4 flex items-center">
                                <div>{e.icon}</div>
                                <div className="ml-1">{e.info}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default LeaderBoardItem;

