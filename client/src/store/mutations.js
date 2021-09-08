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

    updateCode(state, payload){
        state.code = payload;
    },

    updateReplyMailEntity(state, payload){
        state.replyMailEntity = payload;
    }
}