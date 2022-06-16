import firebase from 'firebase';
import { useAsync } from "react-use";
import { useState } from "react";
import * as _ from 'lodash';
import { MeHook } from '../store/me/hooks';
import { RawNotification, RawUser } from '../store/types';
import { FIREBASE_CONFIG } from '../Constants';
import Fetch from '../services/Fetch';

const useNotificationLoadMore = (page_num: number, page_size: number) => {
    const [notifications, setNotifications] = useState<RawNotification[]>([]);

    const [firebase_notifications, setFirebaseNotifications] = useState<RawNotification[]>([]);
    const [has_more, setHasMore] = useState(false);
    const [unseen, setUnseen] = useState(0);
    const me = MeHook.useMe();

    let observer: () => void
    const keep_track = useAsync(async () => {
        if (me) {
            if (firebase.apps.length === 0) {
                await firebase.initializeApp(FIREBASE_CONFIG);
            }
            const notificationQuery = firebase.firestore().collection("notifications").doc(me.id.toString()).collection("notifications");
            const query = notificationQuery.orderBy("since", "desc").limit(1);

            observer = query.onSnapshot(async querySnapShot => {
                var new_value = [...firebase_notifications];
                querySnapShot.docChanges().forEach(change => {
                    if (change.type == 'added') {
                        let notification = change.doc.data() as RawNotification;
                        notification.id = parseInt(change.doc.id);

                        if ((notifications.filter(x => x.id == notification.id).length == 0)) {
                            new_value = [notification, ...new_value]
                        }
                    }
                    else if (change.type == "modified") {

                    }
                });
                console.log("NEW ---NOTI",new_value);

                setFirebaseNotifications(new_value);
                const res = await Fetch.postWithAccessToken<{ unseen: number }>('/api/notification/unseen.get', {});
                if (res.status == 200) {
                    setUnseen(res.data.unseen);
                }
            })
        }
        else {
            if (observer) {
                observer();
                setFirebaseNotifications([])
            }
        }
    }, [me])

    const state = useAsync(async () => {
        if (me) {
            const res = await Fetch.postWithAccessToken<{ notification_num: number, notifications: RawNotification[],users: RawUser[] }>('/api/notification/list', {
                page: page_num,
                page_size: page_size,
            }, [], false);

            if (res.status == 200) {
                if (res.data) {
                    const {notification_num, users} = res.data;
                    var new_notifications = _.unionBy(notifications, res.data.notifications, x => x.id);
                    for(let i = 0; i < new_notifications.length;++i){
                        for(let j = 0; j < users.length; ++j){
                            if(new_notifications[i].from_id == users[j].id){
                                new_notifications[i].from_avatar = users[j].avatar;
                                new_notifications[i].from_name = users[j].username;
                                break;
                            }
                        }
                    }
                    console.log("NOTI CHUAN",new_notifications);
                    setNotifications(new_notifications);
                    setHasMore(notification_num > notifications.length && notifications.length > 0);
                }
            }
        }
    }, [page_num, me])

    return {
        on_loading: state.loading,
        notifications: notifications.length > 0 ? _.unionBy(firebase_notifications, notifications, x => x.id) : [],
        has_more: has_more,
        unseen: unseen,
        setUnseen: setUnseen
    }
}

export default useNotificationLoadMore;
