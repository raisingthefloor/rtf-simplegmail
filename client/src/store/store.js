import {createStore} from 'vuex';
import state from './state';
import mutations from './mutations';

export const store = createStore({
    state,
    mutations,
    getters:{
        /*isGoogleSignedIn: (state) => {
            return state.googleCreds.isSignedIn;
        },*/
        labelName: state => {
            return state.labelName;
        }
    }
});