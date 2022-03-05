import Constants, { Code, exportActionContent, USER_ACTION_METATYPE } from '../../Constants';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Fetch from '../../services/Fetch';
import { Helper } from '../../services/Helper';
import { RawComment, RawPodcast, RawUserActionLog } from '../../store/types';

import { useRouter } from 'next/router';
import { UserHook } from '../../store/user/hooks';
import Avatar from '../../components/ui/Avatar';
import Meta from '../../components/ui/Meta';
import { MeHook } from '../../store/me/hooks';
import UI from '../../services/UI';
import { BsFillChatFill, BsFillHeartFill, BsFilter, BsThreeDots } from 'react-icons/bs';
import GenerateHeader from '../../page.components/new-feeds/_GenerateHeader';
import GenerateContent from '../../page.components/new-feeds/_GenerateContent';
import Link from 'next/link';
import { AiOutlineEdit, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiSend, FiShare2 } from 'react-icons/fi';
import { IoSend } from 'react-icons/io5';
import { IoMdTrash } from 'react-icons/io';
import { Toast } from '../../services/Toast';
import * as uuid from 'uuid'
import { HiOutlineX } from 'react-icons/hi';
import * as _ from 'lodash';
import Recommend from '../../page.components/new-feeds/_Recommend'
import UserInfo from '../../page.components/new-feeds/_UserInfo';
import { FacebookShareButton } from 'react-share';
import useNewFeedsLoadMore from '../../page.components/new-feeds/_useNewFeedsLoadMore';
import LogEvent from '../../packages/firebase/LogEvent';
import HomeFooter from '../../components/footer/HomeFooter';


const NewFeeds = () => {
    const page_size = 20;
    const [reload, setReload] = useState('');
    const [page, setPage] = useState(1);
    const router = useRouter();
    const me = MeHook.useMe();

    const {
        on_loading,
        new_feeds,
        has_more
    } = useNewFeedsLoadMore(page, page_size)

    useEffect(() => {
        LogEvent.sendEvent("new_feeds.view");
    }, [])

    const observer = useRef<any>();
    const lastNewFeedElementRef = useCallback(node => {
        if (on_loading) return;
        if (observer.current) { observer.current.disconnect() }
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && has_more) {
                setPage(page => page + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [on_loading, has_more])


    return (<>
        <Meta />
        <div className="min-h-screen flex px-5 2xl:px-20 sm:px-10 flex-col justify-between">
            <div className="w-full mt-20 flex flex-wrap">
                <div className="none xl:block w-0 xl:w-1/4 px-3">
                    <UserInfo />
                </div>
                <div id="new-feeds" className="w-full md:w-2/3 xl:w-1/2 px-0 sm:px-5 semi-md:px-10">
                    <div>
                        <div className="flex justify-end">
                            <span className="text-2xl text-gray-500"><BsFilter /></span>
                        </div>
                        {me ? (<>
                            <div className="flex items-center mt-2 mb-10">
                                <div className="mr-2.5">
                                    {me.avatar ? (<>
                                        <div style={{ backgroundImage: `url(${Constants.IMAGE_URL + me.avatar})` }}
                                            className="w-9 h-9 rounded-full bg-cover bg-center">
                                        </div>
                                    </>) : (<>
                                        <div style={{ backgroundColor: UI.getColorByString(me.username) }}
                                            className="w-9 h-9 rounded-full bg-cover bg-center flex items-center justify-center">
                                            <span className="text-white font-medium text-xl">{me.fullname.slice(0, 2)}</span>
                                        </div>
                                    </>)}
                                </div>
                                <div className="flex-1">
                                    <input
                                        className="w-full outline-none focus:outline-none border border-black border-opacity-10 rounded-full px-5 py-1.5 block"
                                        placeholder="Start a post" type="text" />
                                </div>
                            </div>
                        </>) : (<></>)}
                    </div>
                    {new_feeds.map((action_log, index) => {
                        if (new_feeds.length == index + 1) {
                            return (
                                <div ref={lastNewFeedElementRef} key={action_log.id} className="w-full">
                                    <ActionLogItem action_log={action_log} />
                                </div>
                            );
                        }

                        return (
                            <div key={action_log.id} className="w-full">
                                <ActionLogItem action_log={action_log} />
                            </div>
                        );

                    })}

                    {on_loading && (<>
                        {[1, 2].map((e) => (<Replacement key={e} />))}
                    </>)}

                    <div className="flex mt-20 mb-28 justify-center items-center">
                        <div
                            className="w-full py-1.5 flex items-center justify-center text-primary  font-medium">
                            {on_loading ? <span className="animate-spin text-3xl mr-1"><AiOutlineLoading3Quarters /></span> : (<></>)}
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 xl:w-1/4 px-0 sm:px-5 md:px-0 semi-md:pl-5 mb-10">
                    <Recommend />
                </div>
            </div>

        </div>
        <div id="footer" className="w-full">
            <div
                style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,.1), rgba(255,255,255,.1)), url('/static/footer.jpg')` }}
                className="flex bg-center bg-cover">
                <HomeFooter />
            </div>
        </div>
    </>)
}


const Replacement = () => {
    return (
        <div className="w-full mb-7 ">
            <div className=" animate-pulse rounded shadow px-3 py-3">
                <div className="flex items-center mb-2">
                    <div className=" flex-shrink-0 rounded-full w-14 h-14 bg-gray-200">

                    </div>
                    <div className="w-full px-4">
                        <div className="h-4  w-full rounded-lg bg-gray-200 mb-2"></div>
                        <div className="h-4  w-4/5 rounded-lg bg-gray-200"></div>
                    </div>
                </div>
                <div className=" ml-16 mr-2">
                    <div className=" w-full h-40 rounded-md bg-gray-200 mb-3">

                    </div>
                </div>
            </div>
        </div>
    );
};


interface Props {
    action_log: RawUserActionLog
};

const ActionLogItem = ({ action_log }: Props) => {
    const user = UserHook.useUser(action_log.user_id);
    const me = MeHook.useMe();
    const [open, setOpen] = useState(false);
    const [on_load_comment, setOnLoadComment] = useState(false);
    const [on_load_edit, setOnLoadEdit] = useState(false);
    const [content, setContent] = useState('');
    const [reload, setReload] = useState('');
    const [edit_content, setEditContent] = useState('');
    const [selected_comment_id, setSelectedCommentId] = useState(-1);

    const onComment = async () => {
        LogEvent.sendEvent("new_feeds.comment");
        if (!content) return;
        if (on_load_comment) return;

        setOnLoadComment(true);
        const res = await Fetch.postWithAccessToken<{
            code: number,
            comment: RawComment
        }>('/api/user.action.log/comment.add', {
            action_log_id: action_log.id,
            content: content
        });

        if (res.status == 200 && res.data.code == Code.SUCCESS) {
            action_log.comments.push(res.data.comment);
            action_log.comment_count = action_log.comment_count + 1;
            setContent('');
            Toast.success("comment successful!");
        } else {
            Toast.error("Some errors occurred")
        }

        setOnLoadComment(false);
    }

    const onEditComment = async () => {
        if (!edit_content) return;
        if (on_load_edit) return;

        setOnLoadEdit(true);
        const res = await Fetch.postWithAccessToken<{
            code: number,
            comment: RawComment
        }>('/api/user.action.log/comment.edit', {
            id: selected_comment_id,
            content: edit_content
        });

        if (res.status == 200 && res.data.code == Code.SUCCESS) {
            action_log.comments.filter(x => x.id == selected_comment_id)[0].content = res.data.comment.content;
            setSelectedCommentId(-1)
            setEditContent('');
            Toast.success("Edit comment successful!");
        } else {
            Toast.error("Some errors occurred")
        }

        setOnLoadEdit(false);
    }

    const onDeleteComment = async (comment_id: number) => {

        const result = await window.confirm("Do you want to delete comment  ?" + comment_id);
        if (!result) {
            return;
        }

        const res = await Fetch.postWithAccessToken<{
            code: number,
            comment: RawComment
        }>('/api/user.action.log/comment.remove', {
            id: comment_id
        });

        if (res.status == 200 && res.data.code == Code.SUCCESS) {
            action_log.comments = action_log.comments.filter(x => x.id != comment_id);
            action_log.comment_count = action_log.comment_count - 1;
            setReload(uuid.v4())
            Toast.success("delete successful!");
        }
        else {
            Toast.error("Some errors occurred!");
        }
    }

    const onLike = async () => {
        LogEvent.sendEvent("new_feeds.like");
        if (!me) return;
        const res = await Fetch.postWithAccessToken<{
            code: number,
            action_log: RawUserActionLog
        }>('/api/user.action.log/like', {
            action_log_id: action_log.id
        });

        if (res.status == 200 && res.data.code == Code.SUCCESS) {
            if (action_log.like_logs.map(x => x.toString()).includes(me.id.toString())) {
                action_log.like_logs = action_log.like_logs.filter(x => x != me.id);
                action_log.likes = action_log.likes - 1;
            } else {
                action_log.like_logs.push(me.id);
                action_log.likes = action_log.likes + 1;
            }
            setReload(uuid.v4());
        }

    }

    if (!user) {
        return <></>;
    }

    const more_than_five_minutes = (action_log.end_time && Math.floor((action_log.end_time - action_log.start_time) / 60) > 5);

    if (!(action_log.metatype != USER_ACTION_METATYPE.METATYPE_LISTENING || more_than_five_minutes)) {
        return <></>;
    }


    return (<>
        <div className="w-full mb-7">
            <div className="rounded-3xl shadow-md px-4 pt-4 pb-6 flex">
                <div className='mr-1'>
                    <Avatar user={user} size={42} />
                </div>

                <div className="flex-1">
                    <div className="flex mb-2 items-start">
                        <div className="w-full">
                            <div className="mb-1">
                                <p className="text-base">
                                    <span className="inline-block font-semibold text-base text-gray-900 mr-1">{user.fullname}</span>
                                    <GenerateHeader action_log={action_log} />
                                </p>
                            </div>
                            <p className="text-gray-500 text-xs">{Helper.getExactDay(action_log.start_time)}</p>
                        </div>
                        <div onMouseMove={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="pl-5 relative">
                            <span className="cursor-pointer px-2 py-1.5 inline-block text-lg hover:bg-gray-200 rounded-md transition-all ">
                                <BsThreeDots />
                            </span>
                            {open && (<>
                                <div className="absolute right-0 w-32 px-2 py-2 rounded shadow bg-white flex flex-col">
                                    <FacebookShareButton url={`${Constants.DOMAIN}/news-feed/${action_log.id}`}>
                                        <button className="outline-none focus:outline-none hover:bg-primary hover:text-white font-medium text-gray-600 rounded py-1 w-full">
                                            Share
                                        </button>
                                    </FacebookShareButton>
                                    <Link href={`/news-feed/${action_log.id}`}>
                                        <a className="outline-none focus:outline-none hover:bg-primary hover:text-white text-center font-medium text-gray-600 rounded py-1 w-full">
                                            See more
                                        </a>
                                    </Link>
                                </div>
                            </>)}
                        </div>
                    </div>
                    <div className="mt-3 pb-4 border-b border-black border-opacity-10">
                        <GenerateContent action_log={action_log} />
                    </div>
                    <div className="flex mt-3 mb-5">
                        <div className="flex mr-4 items-center" onClick={onLike}>
                            <span className={`${(me && action_log.like_logs.map(x => x.toString()).includes(me?.id.toString())) ? "text-red-500" : "text-red-300"} cursor-pointer hover:text-red-500 transition-all text-xl mr-1.5`}><BsFillHeartFill /></span>
                            <span className="font-medium text-sm">{action_log.likes}</span>
                        </div>
                        <div className="flex mr-2 items-center">
                            <span className="text-gray-300 text-xl mr-1.5"><BsFillChatFill /></span>
                            <span className="font-medium text-sm">{action_log.comment_count
                            }</span>
                        </div>
                        <div>
                            <FacebookShareButton
                                url={`${Constants.DOMAIN}/news-feed/${action_log.id}`}
                                className="outline-none focus:outline-none ml-5"
                            >
                                <span onClick={() => LogEvent.sendEvent("new_feeds.share")} className="text-lg text-gray-700">
                                    <FiShare2 />
                                </span>
                            </FacebookShareButton>
                        </div>
                    </div>
                    {me ? (<>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {me.avatar ? (<>
                                    <div style={{ backgroundImage: `url(${Constants.IMAGE_URL + me.avatar})` }}
                                        className=" w-7 h-7 rounded-full bg-center bg-cover">
                                    </div>
                                </>) : (<>
                                    <div style={{ backgroundColor: UI.getColorByString(me.fullname) }}
                                        className=" w-7 h-7 rounded-full bg-center bg-cover flex justify-center items-center text-white font-medium">
                                        <span>{me.fullname[0]}</span>
                                    </div>
                                </>)}
                            </div>
                            <div className="flex-1 ml-2 flex items-center">
                                <div className="flex-1">
                                    <input value={content} onChange={(e) => setContent(e.target.value)}
                                        className="w-full outline-none focus:outline-none border border-black border-opacity-10 rounded-full px-3 py-1 block focus:border-opacity-90"
                                        placeholder="Say something to your friend" type="text" />
                                </div>
                                <div className="ml-2">
                                    <button onClick={() => onComment()} className="text-base w-8 h-8 rounded-full text-gray-400 bg-white hover:bg-red-500 hover:text-white  transition-all flex items-center justify-center shadow">
                                        {on_load_comment ? <span className="animate-spin"><AiOutlineLoading3Quarters /></span> : (<>
                                            <span><IoSend /></span>
                                        </>)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>) : <>
                        <div className="flex items-center justify-center">
                            <Link href="/authentication/login">
                                <a className="text-gray-600 hover:text-gray-700">You need to login to comment</a>
                            </Link>
                        </div>
                    </>}
                    <div>
                        {action_log.comments.map((e, index) => (<>
                            <div className="mt-4 flex">
                                <Link href={`/profile/${Helper.generateCode(e.user_name ? e.user_name : "")}/${e.user_id}`} >
                                    <div className="flex-shrink-0">
                                        {e.user_avatar ? (
                                            <div style={{ backgroundImage: `url("${Constants.IMAGE_URL + e.user_avatar}")` }}
                                                className=" w-7 h-7 rounded-full bg-center bg-cover">
                                            </div>
                                        ) : (
                                            <div style={{ backgroundColor: UI.getColorByString(e.user_name) }}
                                                className=" w-7 h-7 rounded-full text-white bg-center bg-cover flex items-center justify-center">
                                                <span className="font-medium">{e.user_name[0]}</span>
                                            </div>
                                        )}

                                    </div>
                                </Link>
                                <div className="ml-2 flex-1">
                                    <p className="font-medium text-sm">{e.user_name}</p>
                                    <div className="flex w-full">
                                        {selected_comment_id != e.id ? (<>
                                            <p className="text-sm flex-1">{e.content}</p>
                                            {e.user_id == me?.id && (<>
                                                <button onClick={() => { setEditContent(e.content); setSelectedCommentId(e.id) }} className="ml-1 text-base w-7 h-7 rounded-full text-gray-600 bg-white hover:bg-red-500 hover:text-white  transition-all flex items-center justify-center shadow">
                                                    <span><AiOutlineEdit /></span>
                                                </button>
                                                <button onClick={() => onDeleteComment(e.id)} className="ml-1 text-base w-7 h-7 rounded-full text-gray-600 bg-white hover:bg-red-500 hover:text-white  transition-all flex items-center justify-center shadow">
                                                    <span><IoMdTrash /></span>
                                                </button>
                                            </>)}
                                        </>) : (<>
                                            <div className="flex-1">
                                                <input value={edit_content} onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full outline-none focus:outline-none border border-black border-opacity-10 rounded-full px-3 py-1 block focus:border-opacity-90"
                                                    placeholder="Say something to your friend" type="text" />
                                            </div>
                                            <div className="flex-shrink-0 flex items-center">
                                                <button onClick={() => { onEditComment() }} className="ml-1 text-base w-7 h-7 rounded-full text-gray-600 bg-white hover:bg-red-500 hover:text-white  transition-all flex items-center justify-center shadow">
                                                    {on_load_edit ? <span className="animate-spin"><AiOutlineLoading3Quarters /></span> : (<>
                                                        <span><IoSend /></span>
                                                    </>)}
                                                </button>
                                                <button onClick={() => { if (!on_load_edit){setEditContent('') ; setSelectedCommentId(-1)} }} className="ml-1 text-base w-7 h-7 rounded-full text-gray-600 bg-white hover:bg-red-500 hover:text-white  transition-all flex items-center justify-center shadow">
                                                    {on_load_edit ? <span className="animate-spin"><AiOutlineLoading3Quarters /></span> : (<>
                                                        <span><HiOutlineX /></span>
                                                    </>)}
                                                </button>
                                            </div>
                                        </>)}


                                    </div>
                                </div>
                            </div>
                        </>))}

                        {action_log.comments.length > 0 && (
                            <div className="mt-4">
                                <Link href={`/news-feed/${action_log.id}`}>
                                    <a className="text-sm text-medium text-gray-500 hover:text-gray-700">View more comments</a>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>)
};

export default NewFeeds;

