import Fetch from "./services/Fetch";
import { MeFunctions } from './store/me/functions';
import { PodcastCollectionFunctions } from './store/podcast.collection/functions';
import { Helper } from "./services/Helper";
// import LogEvent from "packages/firebase/LogEvent";

class Startup {
    async init() {
        // if (firebase.apps.length ==== 0) {
        //     firebase.initializeApp(FIREBASE_CONFIG);
        // }

        const access_token = await localStorage.getItem('access_token') || Helper.getCookie("access_token");
        if (access_token) {
            await Fetch.setAccessToken(access_token);
            try {
                await MeFunctions.loadProfile();
                // await UserModel.loadUsers();
            } catch (e) {

            }

        } else {

        }
        await PodcastCollectionFunctions.loadAll();
    }
}

export default new Startup();