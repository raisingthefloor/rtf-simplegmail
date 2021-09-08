const logger = require("../logger");
const User = require("../Modules/GoogleApi/Models/User");
const bcrypt =  require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.register = async(reqPayload) => {
    const {name, email, password} = reqPayload;
    const saltRounds = 10;
    let newUser = {};
    try{
        //Instantiating User Model
        newUser = new User({name, email, password});
        //Generate hashed password
        const hash = await bcrypt.hash(password, saltRounds);
        newUser.password = hash;
        //save the user in db
        await newUser.save();
    }
    catch(err){
        logger.error(`Error :: ${err}`);
    }

    return newUser;
}

exports.login = async (reqPayload) => {
    const {email, password} = reqPayload;
    let result = {};
    try{
        const user = await User.findOne({email});
        if(!user){
            result = "User with given mail address not found";
        }

        let match = await bcrypt.compare(password, user.password);
        if(match){
            //Create JWT
            let payload = {
                id: user._id
            }
            let token = createJWT(payload);
            result = {
                name: user.name,
                email: user.email,
                token: token,
                hasGoogleAuth: user.googleAuth.length ? true : false,
                isAuthenticated: true
            }
        }
        else{
            result = "Incorrect User Credentials";
        }
    }
    catch(err){
        logger.error(`Error: ${err}`);
    }

    return result;
}

function createJWT(payload){
    const options = {
        expiresIn: '364d',
        issuer: process.env.FRONT_URL
    }
    const secret = process.env.JWT_SECRET
    return jwt.sign(payload, secret, options)
}

exports.createJWT = createJWT;