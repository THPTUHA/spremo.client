import Loading from '../../components/loading';
import Avatar from '../../components/ui/Avatar';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { FaMedal } from 'react-icons/fa';
import { useAsync } from 'react-use';
import Fetch from '../../services/Fetch';
import { RawBillboard, RawPodcast } from '../../store/types';
import Meta from '../../components/ui/Meta';
import { UserHook } from '../../store/user/hooks';
import DateUtil from '../../services/Date';
import { Helper } from '../../services/Helper';
import { Link, useParams } from 'react-router-dom';

const Billboard = () => {

    const billboards = useAsync(async () => {
        const res = await Fetch.post<{ billboards: RawBillboard[], ts: string, type: string }>('/api/user/billboard.get', {
            ...Helper.getURLParams(),
        });
        return res.data;
    }, [Helper.setAndGetURLParam([])]);


    const cycles = useMemo(() => {
        const current = DateUtil.time();
        const this_week = DateUtil.getMonday(current) + 24 * 3600;
        const this_month = DateUtil.beginMonth(current) + 24 * 3600;
        const last_week = DateUtil.getMonday(current - 7 * 3600 * 24) + 24 * 3600;
        const last_month = DateUtil.beginMonth(DateUtil.beginMonth(current) - 24 * 3600) + 24 * 3600;

        return [
  
            { name: 'Tuần này', path: this_week, type: 'week' },
            { name: 'Tuần trước', path: last_week, type: 'week' },
            { name: 'Tháng này', path: this_month, type: 'month' },
            { name: 'Tháng trước', path: last_month, type: 'month' },
            { name: 'Tất cả', path: 'all', type: 'all' },
        ];
    }, []);

    const show_billboards = useMemo(() => {
        if (!billboards.value) {
            return [];
        }

        var results: any = {};
        var raw_billboards = billboards.value.billboards;
        for (let i = 0; i < raw_billboards.length; i++) {
            if (!results[raw_billboards[i].user_id]) {
                results[raw_billboards[i].user_id] = {
                    total_score: 0,
                    user_id: raw_billboards[i].user_id
                }
            }

            results[raw_billboards[i].user_id].total_score = results[raw_billboards[i].user_id].total_score + raw_billboards[i].score;
        }

        results = Object.values(results).sort((a: any, b: any) => b.total_score - a.total_score);

        return results;
    }, [billboards.value])


    UserHook.useFetchUsers(billboards.value ? billboards.value.billboards.map(e => e.user_id) : []);

    return (
        <>
            <Meta title={'WELE | Bảng xếp hạng'} />
            {billboards.loading ? <Loading /> : (
                <div className="flex items-center">
                    <div className='mt-24 mx-auto shadow-md pb-10 mb-40'>
                        <div className='flex-row flex justify-center text-2xl font-semibold mb-4'>
                            Bảng xếp hạng
                        </div>
                        <div className="container px-10 mx-auto flex-row flex justify-center items-center">
                            <Headers billboards={show_billboards} />
                        </div>
                        <div className="container px-10 my-4 mx-auto flex flex-row">
                            {
                                cycles.map(cycle => (
                                    <BillboardCycle name={cycle.name} path={cycle.path.toString()} type={cycle.type} />
                                ))
                            }

                        </div>
                        <div className="container px-10  mx-auto" style={{ minWidth: 400 }}>
                            {
                                show_billboards.map((billboard: any, index: number) => (
                                    <BillboardItem key={billboard.id} billboard={billboard} index={index} />
                                ))
                            }
                        </div>
                    </div>

                    <div className='h-40'>
                        <div></div>
                    </div>
                </div>
            )}
        </>
    )
};


interface HeadersProps {
    billboards: {
        user_id: number,
        total_score: number
    }[]
}

const Headers = ({ billboards }: HeadersProps) => {
    return (
        <>
            {billboards[4] && <HeaderItem size={40} billboard={billboards[4]} />}
            {billboards[2] && <HeaderItem size={80} billboard={billboards[2]} />}
            {billboards[0] && <HeaderItem size={100} billboard={billboards[0]} />}
            {billboards[1] && <HeaderItem size={80} billboard={billboards[1]} />}
            {billboards[3] && <HeaderItem size={40} billboard={billboards[3]} />}
        </>
    )
}


interface BillboardCycle {
    name: string,
    path: string,
    type: string
}

const BillboardCycle = (props: BillboardCycle) => {

    var {ts, type} = useParams();
    
    if (!ts) {
        ts = (DateUtil.getMonday(DateUtil.time()) + 24 * 3600).toString();
    }

    if (!type) {
        type = 'week';
    }
    
    const active = ts == props.path && type == props.type;

    return (
        <Link to={`?ts=${props.path}&type=${props.type}`}>
            <div className={`${active ? 'bg-primary text-white' : 'hover:bg-gray-200'} font-medium rounded-full text-sm py-1 px-3 cursor-pointer `}>
                {props.name}
            </div>
        </Link>
    );
};

interface BillboardItemProps {
    billboard: {
        user_id: number,
        total_score: number
    },
    index: number
}
const BillboardItem = (props: BillboardItemProps) => {

    const user = UserHook.useUser(props.billboard.user_id);
    return (
        <>
            {user && <div className='w-full px-2 py-4 hover:bg-gray-100 rounded-md' style={{ minWidth: 320 }}>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row items-center">
                        <div className="text-gray-600 mr-3">
                            {(props.index + 1).toString().padStart(2, '0')}
                        </div>
                        <Avatar user={user} />
                        <div className="flex flex-col ml-3">
                            <div className='text-sm'>{user.fullname}</div>
                            <div className="text-sm text-gray-600">Beginner</div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="flex flex-row items-center text-primary">
                            {props.billboard.total_score.toFixed(2)}&nbsp;<FaMedal color='#D7B354' />
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
};


interface HeaderItemProps {
    billboard: {
        user_id: number,
        total_score: number
    },
    size: number
}
const HeaderItem = (props: HeaderItemProps) => {
    var user = UserHook.useUser(props.billboard.user_id);

    if (!user) {
        return null;
    }
    return (
        <div className="flex flex-col items-center mx-5">
            <Avatar user={user} size={props.size} />
            <div className="truncate" title={user.fullname} style={{ maxWidth: props.size * 1.2 }}>{user.fullname}</div>
            <div className="flex flex-row items-center text-primary">{props.billboard.total_score.toFixed(2)}&nbsp;<FaMedal color='#D7B354' /></div>
        </div>
    );
}

export default Billboard;