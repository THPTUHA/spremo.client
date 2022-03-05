import { MeHook } from "../../../store/me/hooks";
import { RawNotification } from "../../../store/types";
import firebase from 'firebase';
import { useAsync } from "react-use";
import Fetch from "../../../services/Fetch";
import { useState } from "react";
import { FIREBASE_CONFIG } from "../../../Constants";
import * as _ from 'lodash';

const useNotificationsLoadMore = (page_num: number, page_size: number) => {
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
                setFirebaseNotifications(new_value);
                const res = await Fetch.postWithAccessToken<{ unseen: number }>('/api/notification/get.unseen', {});
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

    const system_keep_track = useAsync(async () => {
        if (me) {
            if (firebase.apps.length === 0) {
                await firebase.initializeApp(FIREBASE_CONFIG);
            }
            const notificationQuery = firebase.firestore().collection("notifications").doc((-1).toString()).collection("notifications");
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
                });

                setFirebaseNotifications(new_value);
                var res = await Fetch.postWithAccessToken<{ unseen: number }>("/api/notification/get.system.unseen", {});
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
            const res = await Fetch.postWithAccessToken<{ notification_num: number, notifications: RawNotification[] }>('/api/notification/list', {
                page: page_num,
                page_size: page_size,
            }, [], false);

            if (res.status == 200) {
                if (res.data) {
                    var new_notifications = _.unionBy(notifications, res.data.notifications, x => x.id);
                    setNotifications(new_notifications);
                    setHasMore(res.data.notification_num > notifications.length && res.data.notifications.length > 0);
                }
            }
        }
    }, [page_num, me])

    return {
        on_loading: state.loading,
        notifications: notifications.length > 0 ? _.unionBy(firebase_notifications, notifications, x => x.id) : [],
        has_more: has_more,
        unseen: unseen
    }
}

export default useNotificationsLoadMore;
