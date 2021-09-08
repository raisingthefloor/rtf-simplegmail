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
}

module.exports = new authController();