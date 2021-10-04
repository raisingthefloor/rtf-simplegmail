/*
Copyright 2020 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The R&D leading to these results received funding from the:
* Rehabilitation Services Administration, US Dept. of Education under
grant H421A150006 (APCP)
* National Institute on Disability, Independent Living, and
Rehabilitation Research (NIDILRR)
* Administration for Independent Living & Dept. of Education under grants
H133E080022 (RERC-IT) and H133E130028/90RE5003-01-00 (UIITA-RERC)
* European Union's Seventh Framework Programme (FP7/2007-2013) grant
agreement nos. 289016 (Cloud4all) and 610510 (Prosperity4All)
* William and Flora Hewlett Foundation
* Ontario Ministry of Research and Innovation
* Canadian Foundation for Innovation
* Adobe Foundation
* Consumer Electronics Association Foundation
*/

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
    },

    //Updates last active route
    UPDATE_LAST_ACTIVE_ROUTE(state, payload){
        let allowedRoutes = ['/mail-compose', '/inbox'];
        /**add the route to state and localStorage only if it is in 
            allowedRoutes  array*/
        if(allowedRoutes.includes(payload.fullPath)){
            state.lastActiveRoute = payload.fullPath;
            localStorage.setItem('lastActiveRoute', state.lastActiveRoute);    
        }
        
    }
}