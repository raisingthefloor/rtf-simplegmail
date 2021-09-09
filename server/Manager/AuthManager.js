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