import Constants, { FIREBASE_CONFIG } from '../Constants';
import firebase from 'firebase/app';
import 'firebase/firestore';

const instanceFirebaseApp = ()=> {
    if(firebase.apps.length == 0){
        firebase.initializeApp(FIREBASE_CONFIG);
    }

    return firebase;
}

export default instanceFirebaseApp;