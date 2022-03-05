import { Code } from "../../Constants"
import { useState } from "react"
import { useAsync } from "react-use"
import Fetch from "../../services/Fetch"
import { Helper } from "../../services/Helper"
import { RawUserActionLog } from "../../store/types"
import * as _ from 'lodash';
import { UserFunctions } from "../../store/user/functions"

type ResponseType = {
    action_logs: RawUserActionLog[],
    action_log_num: number,
    code: number
}

const useNewFeedsLoadMore = (page_num: number, page_size: number) => {
    const [new_feeds, setNewFeeds] = useState<RawUserActionLog[]>([])
    const [has_more, setHasMore] = useState(false);

    const state = useAsync(async () => {
        const res = await Fetch.postWithAccessToken<ResponseType>('/api/user.action.log/list', {
            ...Helper.getURLParams(),
            page: page_num,
            page_size: page_size,
        });

        if (res.status == 200) {
            if (res.data && res.data.code == Code.SUCCESS) {
                var new_new_feeds = _.unionBy(new_feeds, res.data.action_logs, x => x.id);
                await UserFunctions.loadUserByIds(new_new_feeds.map(e => e.user_id));
                setNewFeeds(new_new_feeds);
                setHasMore(res.data.action_log_num > new_new_feeds.length && res.data.action_logs.length > 0);
            }
        }
    }, [page_num])

    return {
        on_loading: state.loading,
        new_feeds: new_feeds,
        has_more: has_more
    }
}

export default useNewFeedsLoadMore;