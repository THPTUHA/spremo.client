import SideBanner from "../../components/ui/SideBanner";
import Constants from "../../Constants";
import { GoPrimitiveDot } from "react-icons/go";
import UI from "../../services/UI";
import { MeHook } from "../../store/me/hooks";

const UserInfo = () => {

    const me = MeHook.useMe();

    return (<>
        {me ? (<>
            <div className="pl-5">
                <div className="rounded-3xl bg-white shadow-md pt-5 pb-10 px-6 2xl:px-12">
                    <div className="flex items-center justify-center">
                        <div className="rounded-full p-0.5 border border-black border-opacity-10">
                            {me.avatar ? (<>
                                <div style={{ backgroundImage: `url(${Constants.IMAGE_URL + me.avatar})` }}
                                    className="w-20 h-20 rounded-full bg-cover bg-center">
                                </div>
                            </>) : (<>
                                <div style={{ backgroundColor: UI.getColorByString(me.username) }}
                                    className="w-20 h-20 rounded-full bg-cover bg-center flex items-center justify-center">
                                    <span className="text-white font-medium text-3xl">{me.fullname.slice(0, 2)}</span>
                                </div>
                            </>)}
                        </div>
                    </div>

                    <h3 className="text-center mt-2 font-medium text-xl">
                        {me.fullname}
                    </h3>
                    <p className="text-center text-sm text-gray-500">{me.username}</p>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-col  items-center">
                            <p className="font-medium text-lg">98</p>
                            <p className="text-xs text-gray-500">Podcasts</p>
                        </div>
                        <div className=" flex justify-center">
                            <span className="text-xs"><GoPrimitiveDot /></span>
                        </div>
                        <div className="flex flex-col  items-center">
                            <p className="font-medium text-lg">45</p>
                            <p className="text-xs text-gray-500">Posts</p>
                        </div>
                        <div className=" flex justify-center">
                            <span className="text-xs"><GoPrimitiveDot /></span>
                        </div>
                        <div className="flex flex-col  items-center">
                            <p className="font-medium text-lg">25</p>
                            <p className="text-xs text-gray-500">Friends</p>
                        </div>
                    </div>
                    {/* <div className="mt-5">
                        <h5 className="font-medium text-base">Your Friends</h5>
                        <div className="flex justify-between mt-3">
                            {[0, 1, 2, 3].map((e, index) => (
                                <React.Fragment key={index}>
                                    <div className=" flex flex-col items-center">
                                        <div
                                            style={{ backgroundImage: `url(/static/tmp/avatar.jpg)` }}
                                            className="w-9 h-9 rounded-full bg-cover bg-center">
                                        </div>
                                        <p className="text-xs font-medium">Trang</p>
                                    </div>
                                </React.Fragment>
                            ))}
                            <div>
                                <div className="w-9 h-9 rounded-full border-2 border-black flex items-center justify-center">
                                    <span className="text-xl"><BsThreeDots /></span>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>) : <div></div>}

        <div className="pl-5 mt-5">

            <SideBanner />
        </div>
    </>)
}

export default UserInfo;