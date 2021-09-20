/**
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
 **/

const logger = require("../../../logger");
const AuthManager = require("../../../Manager/AuthManager");
const User = require('../Models/User');

class authController{
    registerUser = async (req, res) => {
        let resPayload = {
            error: false,
            data:{}
        }

        try{
            let userInfo = await AuthManager.register(req.body);
            const {name, email, _id} = userInfo;
            let payload = {id: _id};
            let token = AuthManager.createJWT(payload);
            resPayload.data = {name, email, token, hasGoogleAuth: false, isAuthenticated: true};
        }
        catch(e){
            resPayload.error = true;
            logger.error(`Error : ${e}`);
        }

        res.json(resPayload);
    }

    userLogin = async(req, res) => {
        let resPayload = {
            error: false,
            data:{}
        }

        try{
            resPayload.data = await AuthManager.login(req.body);
        }
        catch(e){
            resPayload.error = true;
            logger.error(`Error : ${e}`);
        }

        res.json(resPayload);
    }

    storeGoogleCreds = async (req, res) => {
        let resPayload = {
            error: false,
            data:{}
        }

        try{
            let userInfo = await AuthManager.storeGoogleCreds(req.body);
            const {name, email, _id, googleAuth} = userInfo;
            let payload = {id: _id};
            let token = AuthManager.createJWT(payload);
            resPayload.data = {name, email, token, hasGoogleAuth: resPayload.hasGoogleAuth, isAuthenticated: true};
        }
        catch(e){
            resPayload.error = true;
            logger.error(`Error : ${e}`);
        }

        res.send(resPayload);
    }

    checkGoogleStatus = async (req, res) => {
        let resPayload = {
            error: false,
            data:{userExists: false, hasGoogleAuth: false}
        }

        try{
            const {email, name} = req.body;
            const user = await User.findOne({email});
            if(user){
                resPayload.data.userExists = true;
                if(user.googleAuth){
                    resPayload.data.hasGoogleAuth = true;

                    let jwt = AuthManager.createJWT({id:user._id});
                    resPayload.data.user = {name, email, token:jwt, 
                        hasGoogleAuth: user.googleAuth.length ? true : false, isAuthenticated: true};
                }
            }
        }
        catch(e){
            resPayload.error = true;
        }

        res.send(resPayload);
    }
}

module.exports = new authController();