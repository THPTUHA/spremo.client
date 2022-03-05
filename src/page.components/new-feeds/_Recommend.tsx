import Constants, { Code } from "../../Constants";
import { useAsync } from "react-use";
import Fetch from "../../services/Fetch";
import { Helper } from "../../services/Helper";
import { MeHook } from "../../store/me/hooks";
import { RawPodcast } from "../../store/types";
import { Link } from "react-router-dom";

const Recommend = () => {
    const me = MeHook.useMe();

    const recommend = useAsync(async () => {
        const res = await Fetch.postWithAccessToken<{ code: number, podcasts: RawPodcast[] }>('/api/podcasts/recommend', {
            user_id: me?.id
        })

        if (res.status == 200) {
            if (res.data && res.data.code == Code.SUCCESS) {
                return {
                    podcasts: res.data.podcasts
                }
            }
        }

        return {
            podcasts: []
        }
    }, [me])

    return (<>
        {recommend.value ? (<>
            <div className="rounded-3xl bg-white shadow-md pt-5 pb-10 px-6  md:fixed md:w-1/3 xl:w-1/4 right-2 semi-md:right-5">
                <div>
                    <h3 className="font-medium text-lg">Recommend for you</h3>
                </div>
                <div>
                    {recommend.value.podcasts.map((podcast) => (
                        <div key={podcast.id} className="mt-3  border-b border-black border-opacity-10">
                            <Link to={`/podcasts/detail/${Helper.generateCode(podcast.name)}_${Helper.generateCode(podcast.sub_name)}/${podcast.id}`}>
                                <a className="flex">
                                    {/* <div className=" w-1/4  mr-5 flex-shrink-0 ">
                                        <img className="rounded box-content h-16 bg-cover bg-no-repeat" src={Constants.IMAGE_URL + podcast.image_url} alt="" />
                                    </div> */}
                                    <div
                                        style={{
                                            backgroundImage: `url(${Constants.IMAGE_URL + podcast.image_url})`
                                        }}
                                        className="bg-center flex-shrink-0 bg-cover bg-no-repeat mr-5 w-1/4 rounded-lg mb-2">
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-blue-500">{podcast.name}</h5>
                                        <p className="text-sm text-gray-500">ESL {podcast.sub_name}</p>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>) : (<></>)}
    </>)
}

export default Recommend;
