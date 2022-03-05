import { HorizontalLoading } from "../../components/loading";
import Meta from "../../components/ui/Meta";
import Constants, { Code, LAYOUT_TYPES } from "../../Constants";
import moment from "moment";
// import Link from "next/link";
import {Link} from 'react-router-dom';
import { useRouter } from "next/router";
import useNotificationsLoadMore from "../../page.components/admin/notifications/_userNotificationsLoadmore";
import React, { useCallback, useRef, useState } from "react";

//@ts-ignore
import ReactHtmlParser from 'react-html-parser';
import { RiNotificationOffFill } from "react-icons/ri";
import { Helper } from "../../services/Helper";
import UI from "../../services/UI";
import { MeHook } from "../../store/me/hooks";
import { RawNotification } from "../../store/types";
import { UserHook } from "../../store/user/hooks";
import { Toast } from "../../services/Toast";
import Fetch from "../../services/Fetch";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Index = () => {
    const me = MeHook.useMe();
    const route = useRouter();
    const [page, setPage] = useState(1);
    const page_size = 10;

    const {
        on_loading,
        notifications,
        has_more,
        unseen
    } = useNotificationsLoadMore(page, page_size)

    UserHook.useFetchUsers([...notifications.map(e => e.user_id)])

    const observer = useRef<any>();
    const lastNotificationElementRef = useCallback(node => {
        if (on_loading) return;
        if (observer.current) { observer.current.disconnect() }

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && has_more) {
                setPage(page => page + 1)
            }
        })

        if (node) observer.current.observe(node);
    }, [on_loading, has_more])

    return (<>
        <Meta/>
        <div className="shadow-lg rounded-lg px-5 py-5">
            <div className="flex-1 flex flex-col ">
                <div>
                    <h3 className="m-0 mb-3 text-xl font-medium">Thông báo của tôi</h3>
                </div>
                <div className="bg-white h-full rounded-t flex-1 px-3 sm:px-6 pt-3">
                    <div className=" sm:h-screen-70 overflow-y-auto">
                        {notifications.map((notification, index) => {
                            if (notifications.length == index + 1) {
                                return (
                                    <div key={notification.id} ref={lastNotificationElementRef} >
                                        <NotificationItem notification={notification} />
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div key={notification.id}>
                                        <NotificationItem notification={notification} />
                                    </div>
                                )
                            }
                        })}

                        {!on_loading && notifications.length == 0 && (<>
                            <div className="flex mt-10 items-center justify-center">
                                <span className="text-3xl text-gray-400 mr-3"><RiNotificationOffFill /></span>
                                <span className="text-xl font-medium text-gray-400">Bạn không có thông báo nào</span>
                            </div>
                        </>)}

                        <div className="py-2 mb-10">
                            {on_loading && <HorizontalLoading />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
const ContentNotification = ({notification}:{notification: RawNotification}) => {
    const [noti, setNoti] = useState(notification);
    const [loading,setLoading] = useState(0);
    const onResponse = async (option: string)=>{
        try {
            setLoading((option.split(".")[0] == "accept"? 1 : 2));
            const url = `/api/team.challenge/${option}`;
            console.log(url);
            const res = await Fetch.postWithAccessToken<{notification: RawNotification,message: string, code: number }>(url, 
                {notification_id: notification.id}
            );
            if (res && res.data) {
                if (res.data.code == Code.SUCCESS) {
                    setNoti(res.data.notification);
                    Toast.success( `${option.split(".").join(" ")} successful`)
                }else{
                    Toast.error(res.data.message)
                }
            }
        }catch(err){
            console.log(err);
            Toast.error("ERROR!");
        }
        setLoading(0);
    }

    if (noti.link && noti.link.toLowerCase().startsWith("http") && noti.content) {
        return (
            <a target={"_blank"} className="cursor-pointer inline-block ml-5 text-gray-500 hover:text-gray-700 transition-all" href={notification.link}>
                <p className="m-0 mb-1" >{ReactHtmlParser(noti.content)}</p>
            </a>
        )
    }
    return (
        <>
        {
            noti.content && (
                <div >
                    <Link to={noti.link ? noti.link : ''}>
                        <a className="cursor-pointer ml-5 text-gray-500 hover:text-gray-700 transition-all">
                            <p className="m-0 mb-1" >{ReactHtmlParser(noti.content)}</p>
                        </a>
                    </Link>
                    {
                        (noti.action == "invite" || noti.action == "request") && (
                            <div className="flex">
                                <a onClick={()=>onResponse(`accept.${noti.action}`)} className="cursor-pointer mr-4 outline-none w-16 focus:outline-none bg-green-500 text-white flex mb-6 items-center justify-center py-1 rounded font-medium  shadow hover:bg-primary-dark transition-all">
                                    {loading == 1 && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                                    <span >Accept</span>
                                </a>
                                 <a  onClick={()=>onResponse(`decline.${noti.action}`)}  className="cursor-pointer outline-none w-16 focus:outline-none bg-red-500 text-white flex mb-6 items-center justify-center py-1 rounded font-medium  shadow hover:bg-primary-dark transition-all">
                                    {loading == 2 && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                                    <span >Delete</span>
                                </a>
                            </div>
                        )
                    }
                </div>
            )
        }
        </>
    )
}
const NotificationItem = ({ notification }: { notification: RawNotification }) => {
    return (<>
        <Meta title={`WELE | Notifications`} />
        <div id={`noti_${notification.id}`} className="py-5 border-b border-black border-opacity-5 pr-3">
            {
                notification.content && (
                    <div className="flex items-center">
                        <div className="w-16 sm:w-32 flex-shrink-0 text-sm">
                            <p className="m-0">
                                {moment(new Date(notification.since * 1000)).format('HH:mm')}
                            </p>
                            <p className="m-0">
                                {moment(new Date(notification.since * 1000)).format('DD/MM/YYYY')}
                            </p>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                            <div className="w-24 flex items-center justify-center" >
                                {notification.image ? (<>
                                    <div className="bg-contain bg-no-repeat bg-center h-12 w-12 rounded-full mx-auto my-0" style={{
                                        backgroundImage: `url("${Constants.IMAGE_URL + Helper.normalizeUrl(notification.image)}")`
                                    }}>
                                    </div>
                                </>) : (<>
                                    <div className="flex items-center justify-center h-12 w-12 rounded-full mx-auto my-0" style={{
                                        backgroundColor: UI.getColorByString(notification.from_name ? notification.from_name : "Admin")
                                    }}>
                                        <span className="text-lg text-white"> {(notification.from_name ? notification.from_name : "Admin").slice(0, 2)} </span>
                                    </div>
                                </>)}
                            </div>
                        </div>
                        <ContentNotification notification={notification}/>
                    </div>
                )
            }
        </div>
    </>)
}


Index.layout = LAYOUT_TYPES.Profile;

export default Index;