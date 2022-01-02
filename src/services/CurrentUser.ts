import {RawUser} from '../store/types';

class CurrentUser{
    __currentuser: RawUser | null = null;
    setUser(value: RawUser) {
        this.__currentuser = value;

    }

    getUser() {
        return this.__currentuser;
    }

    logout() {
        this.__currentuser = null;
    }
}


export default new CurrentUser();