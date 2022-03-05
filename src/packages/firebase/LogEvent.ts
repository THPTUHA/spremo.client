import Constants, { FIREBASE_CONFIG } from '../../Constants';
import  firebase from 'firebase/app';
import 'firebase/analytics';

class LogEvent {
    async sendEvent(event_name: string, object?: any) {
        if (firebase.apps.length === 0) {
            await firebase.initializeApp(FIREBASE_CONFIG);
        }
        if (object) {
            console.log("firebase_app_" + firebase.apps.length);
            await firebase.analytics().logEvent(event_name, object);
            
        }
        else {
            console.log("firebase_app_" + firebase.apps.length);
            await firebase.analytics().logEvent(event_name);
        }
    }
}

export default new LogEvent();