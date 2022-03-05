import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CgDetailsMore } from "react-icons/cg";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { useAsync } from "react-use";
import LeaderBoard from "../../components/leader.board/LeaderBoard";
import Constants, { Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Helper } from "../../services/Helper";
import { Toast } from "../../services/Toast";
import { LeaderBoardItemProps, PerformanceProps, PodcastChallengeListen } from "../../store/interface";
import { MeHook } from "../../store/me/hooks";
import { RawPodcast, RawPodcastChallenge, RawUser } from "../../store/types";
import Performance from "./Performance";


interface PodcastDetailResponse {
    podcast_challenge: RawPodcastChallenge,
    podcast_challenges: RawPodcastChallenge[],
    users: RawUser[],
    is_submitted: boolean,
    is_finshed: boolean,
    rank: number,
    member_number: number,
    user: RawUser,
    code: number,
    message: string
}

const PodcastDetail = ({ podcast, podcast_challenge }: { podcast: RawPodcast, podcast_challenge?: RawPodcastChallenge }) => {
    const me = MeHook.useMe();
    const [page, setPage] = useState(1);
    const [podcast_challenge_id, setPodcastChallengeId] = useState(podcast_challenge ? podcast_challenge.id : 0);

    const podcast_detail_state = useAsync(async () => {
        if (podcast_challenge_id) {
            try {
                const res = await Fetch.postWithAccessToken<PodcastDetailResponse>('/api/record.challenge.user/podcast.detail', {
                    podcast_challenge_id: podcast_challenge_id
                });

                if (res && res.data && res.data.code == Code.SUCCESS) {
                    const { podcast_challenge, podcast_challenges, rank, users, is_finshed, is_submitted, member_number, user } = res.data;
                    podcast_challenges.sort((a, b) => b.point - a.point);
                    const map_user = Helper.mapUserById(users);
                    const map_point = Helper.mapPointToRank(podcast_challenges.map(e => e.point));
                    const user_podcast_challenge = [] as LeaderBoardItemProps[];

                    const performance = {
                        time_listen: podcast_challenge.time_listen,
                        point: podcast_challenge.point,
                        member_number: member_number,
                        title: (me && me.id == podcast_challenge.user_id) ? "Your podcast performance" : `${user.fullname}'s podcast performance`,
                        rank: rank
                    };

                    for (const podcast_challenge of podcast_challenges) {
                        const user = map_user[podcast_challenge.user_id];
                        const rank = map_point[podcast_challenge.point];

                        user_podcast_challenge.push({
                            id: podcast_challenge.id,
                            rank: rank,
                            rank_status: Helper.getRankStatus(rank, podcast_challenge.rank_record),
                            is_pos: true,
                            avatar: {
                                name: user.fullname,
                                img: user.avatar,
                                link: `/profile/${Helper.generateCode(user.username ? user.username : "")}/${user.id}`,
                                sub_name: user.username,
                            },
                            extensions: [{ info: (podcast_challenge.point / 100).toFixed(2) }]
                        })
                    }
                    return {
                        performance: performance,
                        user_podcast_challenge: user_podcast_challenge,
                        member_number: member_number,
                        is_finshed: is_finshed,
                        is_submitted: is_submitted,
                    }
                }
                Toast.error(res.data.message);

            } catch (error) {
                console.log(error);
                Toast.error("ERROR!!");
            }
        }
        return {
            performance: {} as PerformanceProps,
            user_podcast_challenge: [] as LeaderBoardItemProps[],
            member_number: 0,
            is_finshed: false,
            is_submitted: false,
        }
    }, [podcast_challenge_id]);

    return (
        <div>
            {
                podcast_detail_state.loading && (
                    <div className="flex items-center">
                        <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters/></span>
                        <span >Loading...</span>
                    </div>
                )
            }
            {
                !podcast_detail_state.loading && podcast_detail_state.value && (
                    <div className="mt-5">
                        <div className="ml-5">
                            <Link to={`/podcasts/detail/${Helper.generateCode(podcast.name)}/${podcast.id}`}>
                                <div className="text-base text-gray-500 hover:text-gray-700">{podcast.sub_name}/{podcast.name}</div>
                            </Link>
                            <Performance {...podcast_detail_state.value.performance} />
                        </div>
                        <div className="border-black-200" ></div>
                        <LeaderBoard items={podcast_detail_state.value.user_podcast_challenge} item_number={podcast_detail_state.value.member_number} page={page} setPage={setPage} handleData={setPodcastChallengeId} />
                    </div>
                )
            }
        </div>
    )
}

const PodcastItem = ({ podcast, podcast_challenge }: PodcastChallengeListen) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="py-1 mb-5 hover:shadow-lg ">
            <div className=" w-full flex justify-between items-center md:items-stretch box-border px-2  py-2 rounded-lg transition-all">
                <div className="flex items-center cursor-pointer">
                    <Link to={`/podcasts/detail/${Helper.generateCode(podcast.name)}/${podcast.id}`}>
                        <div
                            style={{
                                backgroundImage: `url(${Constants.IMAGE_URL + podcast.image_url})`,
                                width: 73, height: 37
                            }}
                            className="bg-center flex-shrink-0 bg-cover bg-no-repeat  rounded-full">

                        </div>
                    </Link>
                    <div className="pl-3  md:pl-2 flex flex-col justify-between ">
                        <div className="flex items-center">
                            <Link to={`/podcasts/detail/${Helper.generateCode(podcast.name)}/${podcast.id}`}>
                                <p className="text-base font-medium text-blue-500 cursor-pointer">
                                    {podcast.sub_name}
                                </p>
                            </Link>
                            {
                                podcast_challenge &&
                                <div className="ml-2 cursor-pointer hover:text-gray-500" onClick={() => { setOpen(true) }}>
                                    <CgDetailsMore/>
                                </div>
                            }
                        </div>
                        <Link to={`/podcasts/detail/${Helper.generateCode(podcast.name)}/${podcast.id}`}>
                            <p className="text-base text-gray-500 cursor-pointer">
                                {podcast.name}
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
            <Modal
                classNames={{
                    modal: "rounded-lg overflow-x-hidden w-11/12 xs:w-2/5"
                }}
                onClose={() => setOpen(false)} open={open && (podcast_challenge ? true : false)}>
                <>
                    <PodcastDetail podcast_challenge={podcast_challenge} podcast={podcast} />
                </>
            </Modal>
        </div>
    );
}

const ListPodcast = ({ podcast_listens, title }: { podcast_listens: PodcastChallengeListen[], title: string }) => {
    return (
        <div className="w-full" style={{ maxWidth: 550, minWidth: 500 }}>
            <div className='font-medium text-xl mt-5 mb-5'>{title}</div>
            <div className='flex flex-wrap pb-1 pr-5 items-center'>
                {
                    podcast_listens.map((podcast_listen) => (
                        <div key={podcast_listen.podcast.id} className="w-1/2">
                            <PodcastItem {...podcast_listen} />
                        </div>
                    ))
                }
            </div>
            <div className="border-black-200" style={{ borderBottomWidth: 1 }}></div>
        </div>
    )
}

export default ListPodcast;