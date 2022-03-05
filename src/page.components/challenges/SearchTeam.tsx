import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { MdPublic, MdPublicOff } from "react-icons/md";
import { useAsync } from "react-use";
import LeaderBoardItem from "../../components/leader.board/LeaderBoardItem";
import { Code, TeamStatus } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { LeaderBoardItemProps, ListTeamResponse } from "../../store/interface";

const SearchTeam = ({ challenge_id, handleData }: { challenge_id: number, handleData: (value: number) => void }) => {
    const page_size = 10;
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");


    const state = useAsync(async () => {
        if (q) {
            try {
                const res = await Fetch.postWithAccessToken<ListTeamResponse>('/api/team.challenge/list', {
                    q: q,
                    page: page,
                    challenge_id: challenge_id,
                    page_size: page_size
                });
                if (res.status == 200) {
                    if (res.data && res.data.code == Code.SUCCESS) {
                        const { teams } = res.data;
                        const team_items = [] as LeaderBoardItemProps[];
                        for (const team of teams) {
                            team_items.push({
                                id: team.id,
                                rank: 0,
                                rank_status: 0,
                                is_pos: false,
                                avatar: {
                                    name: team.name,
                                    img: team.avatar,
                                    link: "",
                                },
                                extensions: [{ info: "", icon: (team.status == TeamStatus.PUBLIC ? <MdPublic/> : <MdPublicOff/>) }]
                            })
                        }

                        return {
                            team_items: team_items,
                        }
                    }
                    Toast.error(res.data.message);
                }

            } catch (error) {
                console.log(error);
                Toast.error("ERROR!");
            }
        }
        return {
            team_items: [],
        }
    }, [q, page]);

    return (
        <div className="flex flex-col items-center mt-4">
            <div className='flex items-center mt-4 w-full justify-center'>
                <IoSearch/>
                <input onChange={e => setQ(e.target.value)} type="text" placeholder=' Search team...' value={q} className=" pl-1 h-8 outline-none w-full" />
            </div>
            <div>
                {
                    state.loading && <div className="text-green-500 text-lg flex px-2 py-2 items-center">
                        <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters/></span>
                        <span >Loading...</span>
                    </div>
                }
                <div>
                    {
                        state.value && state.value.team_items.map((team) =>
                            <div className="cursor-pointer" key={team.id} onClick={() => { handleData(team.id) }}>
                                <LeaderBoardItem {...team} min_width={400} />
                            </div>
                        )
                    }
                </div>
            </div>

        </div>
    )
}

export default SearchTeam;