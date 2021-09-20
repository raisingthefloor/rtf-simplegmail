export default {

    UPDATE_USER(state, payload){
        state.appActiveUser = Object.assign({}, state.appActiveUser, payload);
        if(localStorage.getItem('appActiveUser')){
            localStorage.setItem('appActiveUser', JSON.stringify(state.appActiveUser));
        }
        else{
            localStorage.setItem('appActiveUser', JSON.stringify(state.appActiveUser));
        }
        //state.appActiveUser = JSON.parse(localStorage.getItem('appActiveUser'));
    },

    LOGOUT_USER(state){
        state.appActiveUser = {
            name : "",
            email: "",
            token: null,
            hasGoogleAuth: false,
            isAuthenticated: false
        }
        localStorage.removeItem('appActiveUser');
    },

    updateCode(state, payload){
        state.code = payload;
    },

    updateReplyMailEntity(state, payload){
        state.replyMailEntity = payload;
    },

    UPDATE_GOOGLE_AUTH_STATUS(state, payload){
        //payload here is a boolean value
        state.googleCreds.isSignedIn = payload;
    },

    //Sets the name for new folder to be created
    UPDATE_LABEL_NAME(state, payload){
        state.labelName = payload;
    }
}