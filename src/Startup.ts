import Fetch from "./services/Fetch";
import { MeFunctions } from './store/me/functions';
import { Helper } from "./services/Helper";
import  firebase from 'firebase/app';
import  { FIREBASE_CONFIG } from './Constants';
import { SocketFunctions } from "./store/socket/funtions";

class Startup {
    async init() {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }

        const access_token = await localStorage.getItem('access_token') || Helper.getCookie("access_token");
        if (access_token) {
            await Fetch.setAccessToken(access_token);
            await SocketFunctions.init();
            try {
                await MeFunctions.loadProfile();
            } catch (e) {

            }

        } else {

        }
        // await ChallengeFunctions.loadRawChallenges();
        // await PodcastCollectionFunctions.loadAll();
    }
}

export default new Startup();