import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { useAsync } from "react-use";
import LeaderBoardItem from "../../components/leader.board/LeaderBoardItem";
import { Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Helper } from "../../services/Helper";
import { Toast } from "../../services/Toast";
import { LeaderBoardItemProps, ListUserResponse } from "../../store/interface";

const SearchUser = ({ challenge_id, handleData }: { challenge_id: number, handleData?: (value: number) => void }) => {
    const page_size = 10;
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");

    const state = useAsync(async () => {
        if (q) {
            try {
                const res = await Fetch.postWithAccessToken<ListUserResponse>('/api/record.challenge.user/user.list', {
                    q: q,
                    page: page,
                    challenge_id: challenge_id,
                    page_size: page_size
                });
                if (res.status == 200) {
                    if (res.data && res.data.code == Code.SUCCESS) {
                        const { users, record_challenge_users } = res.data;
                        const map_user = Helper.mapUserById(users);
                        const user_items = [] as LeaderBoardItemProps[];

                        for (const record of record_challenge_users) {
                            const user = map_user[record.user_id];
                            user_items.push({
                                id: record.id,
                                rank: 0,
                                rank_status: 0,
                                is_pos: false,
                                avatar: {
                                    name: user.fullname,
                                    img: user.avatar,
                                    link: `/profile/${Helper.generateCode(user.username ? user.username : "")}/${user.id}`,
                                    sub_name: user.username,
                                },
                                extensions: []
                            })
                        }

                        return {
                            user_items: user_items,
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
            user_items: [],
        }
    }, [q, page]);

    return (
        <div className="flex flex-col items-center">
            <div className='flex items-center mt-4 w-full justify-center'>
                <IoSearch/>
                <input onChange={e => setQ(e.target.value)} type="text" placeholder=' Search user...' value={q} className=" pl-1 h-8 outline-none w-full" />
            </div>
            <div>
                {   
                    state.loading && 
                    <div className="text-green-500 text-lg flex px-2 py-2 items-center">
                        <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters/></span>
                        <span >Loading...</span>
                    </div>
                }
                <div>
                    {
                        state.value && state.value.user_items.map((user_item) =>
                            <div className={`${handleData ? "cursor-pointer" : ""}`} key={user_item.id} onClick={() => { if (handleData) handleData(user_item.id) }}>
                                <LeaderBoardItem {...user_item} min_width={400} />
                            </div>
                        )
                    }
                </div>
            </div>

        </div>
    )
}

export default SearchUser;