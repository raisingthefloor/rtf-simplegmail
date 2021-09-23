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

//module imports here
const logger = require("../../../logger");
const {google} = require('googleapis');
const GoogleManager = require("../../../Manager/GoogleManager");
const AuthManager = require("../../../Manager/AuthManager");
const fs = require('fs/promises');
const formidable = require('formidable');
const MailComposer = require("nodemailer/lib/mail-composer");
const User = require("../Models/User");
const Sentry = require("@sentry/node");


//Controller definition
class GmailController{
    redirectUrl = '';
    SCOPES = ['https://www.googleapis.com/auth/gmail.modify', 'https://mail.google.com/',
        'https://www.googleapis.com/auth/contacts', 'https://www.googleapis.com/auth/contacts.other.readonly',
        'profile', "https://www.googleapis.com/auth/userinfo.email"];

    //return OAuth2Client which request the google server for resources
    getOAuth2Client = () => {
        
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const {client_secret, client_id, redirect_uris} = credentials.web;
        //using OAuthClient object for authentication and authorization
        let redirectUrlIndex = redirect_uris.findIndex(uri => this.redirectUrl === uri);
        return new google.auth.OAuth2(client_id, client_secret, redirect_uris[1]);
    }

    //methods to handle requests
    /**
     * @route GET /api/connect
     * @desc connects with googleapis 
     * @access shoould be private
     */
    /*apiConnect = async (req, res) => {
        let response = {
            error: false,
            data: {}
        }
        let generateURL = false;
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris);
        let authUrl = '';
        try{
            let user = await User.findOne({_id: req.user.id});
            if(!user){
                response.error = true;
                response.data = 'No User Found';
                res.status(400).send(response);
            }
            if(!user.googleAuth){
                generateURL = true;
            }
        }
        catch(err){
            response.error = true;
            response.data = err;
        }
        
        if(generateURL){
            authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: this.SCOPES,
                prompt: 'consent'
            });
            response.data.url = authUrl;
        }
        else{
            response.data.hasGoogleAuth = true;
        }
        res.send(response)
    }*/

    googleConnect = async (req, res) => {
        let response = {
            error: false,
            data: {}
        }
        let authUrl = '';
        this.redirectUrl = req.headers['x-forwarded-proto']+'://'+req.headers['x-forwarded-host']+'/googlecallback';
        try{
            const oAuth2Client = this.getOAuth2Client();
            authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: this.SCOPES,
                //prompt: 'consent'
            });
            response.url = authUrl;
        }
        catch(exp){
            Sentry.captureException(exp);
            logger.error(exp);
            response.error = true;
        }

        res.send(response);
    }

    /*apiGoogleCallback = async (req, res) => {
        //get access token and refresh token in exchange of authorization code
        const token = await GoogleManager.getToken(req.body.code);
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const {client_secret, client_id, redirect_uris} = credentials.web;
        let oAuth2Client = "", userProfile = {}, response = {error: false, data:{}};
        if(token){
            oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris)
            oAuth2Client.setCredentials(token)

            //get user profile
            userProfile = await GoogleManager.getUserProfile(oAuth2Client);

            //adding the token to authenticated user
            let data = JSON.stringify(token);
            try{
                userProfile = await User.findOne({_id: req.user.id});
                userProfile.googleAuth = data;
                userProfile.save();
                let hasGoogleAuth = userProfile.googleAuth ? true : false;
                response.data = {hasGoogleAuth};
            }
            catch(err){
                response.error = true;
                logger.error(err);
            }

        }
        res.send(response);
    }*/
    googleCallback = async(req, res) => {
        let userProfile = {}, response = {error: false, data:{}};
        try{
            //get access token and refresh token in exchange of authorization code
            const token = await GoogleManager.getToken(req.body.code);
            const oAuth2Client = this.getOAuth2Client();
            oAuth2Client.setCredentials(token)
            
            //get user profile
            userProfile = await GoogleManager.getUserProfile(oAuth2Client);
            let name = userProfile.names[0]?.displayName;
            let email = userProfile.emailAddresses[0]?.value;
            response.data = {name, email};
            
            //gets exisiting user or null
            let user = await User.findOne({email});
            //if user does not exists, create one
            if(!user) user = await this.storeUser({name, email, token});
            
            let jwt = AuthManager.createJWT({id:user._id});
            response.data = {name, email, token:jwt, 
                hasGoogleAuth: user.googleAuth.length ? true : false, isAuthenticated: true};
        }
        catch(exp){
            Sentry.captureException(exp);
            logger.error(`Error in google callback : ${exp}`);
            response.error = true
        }

        res.send(response);
    }

    storeUser = async({name, email, token}) => {
        try{
            token = JSON.stringify(token);
            //if(!user){
                const newUser = new User({
                    name,
                    email,
                    googleAuth: token
                });
    
                await newUser.save();
            //}
            /*else{
                //saving the token in user object
                user.googleAuth = token;
                await user.save();
            }*/
            return newUser;
        }
        catch(exp){
            Sentry.captureException(exp);
            logger.error(`Error while creating new user : ${exp}`);
        }
    }

    getMails = async (req, res) => {
        let response = {error: false, data: [], nextPageToken: null};
        let labelIds = [req.params.type.toUpperCase()];
        let  {nextPage} = req.query;
        nextPage = nextPage === "null" ? '' : nextPage;

        //get OAuth2Client Client
        const oAuth2Client = this.getOAuth2Client();

        let allMailDetails = [];
        try{
            let user = await User.findOne({_id: req.user.id});
            if(!user){
                response.error = true;
            }
            else{
                //get google authentication token from user
                let googleAuthCode = JSON.parse(user.googleAuth);

                //check auth code is not empty
                if(Object.keys(googleAuthCode).length){
                    oAuth2Client.setCredentials(googleAuthCode);

                    //get a specified number of mail containing threadId and messageId
                    let responseObj = await GoogleManager.getMessages(oAuth2Client, labelIds, nextPage);
                    let {messages, nextPageToken} = responseObj;
                    let allMails = messages;
                    response.nextPageToken = nextPageToken;
                    if(req.params.id){
                        //fetch message metadata for allMails
                        for(let mail of allMails){
                            let mail_meta = await GoogleManager.getSingleMessageMetadata(oAuth2Client, mail.id);
                            allMailDetails.push(mail_meta);
                        }
                    }
                    else{
                        for (let mail of allMails)
                        {
                            let mail_detail = await GoogleManager.getSingleProcessedMessageDetails(oAuth2Client, mail);
                            let messageId = mail_detail.payload.headers.find(obj => obj.name == "Message-ID")
                            
                            if(mail_detail.decoded_attachments && mail_detail.decoded_attachments.length)
                            {
                                let i = 0
                                for (let attachment of mail_detail.decoded_attachments)
                                {
                                    let attachment_data = await GoogleManager.attachmentData(oAuth2Client, messageId, attachment);
                                    mail_detail.decoded_attachments[i].attachment_data = attachment_data;
                                    i++;
                                }
                            }

                            allMailDetails.push(mail_detail)
                        }
                    }
                                        
                    response.data = allMailDetails;
                }
            }
        }
        catch(exp){
            Sentry.captureException(exp);
            logger.error(exp);
            response.error = true;
        }

        res.send(response);
    }

    getAllContacts = async (req, res) => {
        let response = {error: false, data: []};
        try{
            const oAuth2Client = this.getOAuth2Client();
            //an array to hold a list of authenticated user contacts
            let contacts = [];

            //get google authentication token from auth user
            let user = await User.findOne({_id: req.user.id});
            if(!user){
                response.error = true;
            }
            let googleAuthCode = JSON.parse(user.googleAuth);

            //check auth code is not empty
            if(Object.keys(googleAuthCode).length){
                oAuth2Client.setCredentials(googleAuthCode);

                contacts = await GoogleManager.listAllConnections(oAuth2Client);
            }
            response.data = contacts;
        }
        catch(exp){
            Sentry.captureException(exp);
            logger.error(exp);
            response.error = true;
        }
        
        res.send(response);
    }

    trashMessage = async (req, res) => {
        let response = {error: false, data: []};

        //the message object representing the message that is to be trashed
        let message = {userId : req.params.uid, id: req.params.mid};

        try{
            const oAuth2Client = this.getOAuth2Client();
        
            //The message which is trashed
            let trashedMessage = {};
            
            //get google authentication token from auth user
            let user = await User.findOne({_id: req.user.id});
            if(!user){
                response.error = true;
            }
            let googleAuthCode = JSON.parse(user.googleAuth);

            //check auth code is not empty
            if(Object.keys(googleAuthCode).length){
                oAuth2Client.setCredentials(googleAuthCode);

                trashedMessage = await GoogleManager.trashMessage(message, oAuth2Client);
            }
            response.data = trashedMessage;
        }
        catch(exp){
            Sentry.captureException(exp);
            logger.error(exp);
            response.error = true;
        }
        
        res.send(response);
    }

    deleteFromTrash = async(req, res) => {
        let response = {error: false, data: []};

        //the message object representing the message that is to be removed from trash
        let message = {userId : req.params.uid, id: req.params.mid};

        try{
            const oAuth2Client = this.getOAuth2Client();
        
            //The message which is removed from trash
            let deletedMessage = {};
            
            //get google authentication token from auth user
            let user = await User.findOne({_id: req.user.id});
            if(!user){
                response.error = true;
            }
            let googleAuthCode = JSON.parse(user.googleAuth);

            //check auth code is not empty
            if(Object.keys(googleAuthCode).length){
                oAuth2Client.setCredentials(googleAuthCode);

                deletedMessage = await GoogleManager.deleteFromTrash(message, oAuth2Client);
            }
            response.data = deletedMessage;
        }
        catch(exp){
            Sentry.captureException(exp);
            logger.error(exp);
            response.error = true;
        }
        res.send(response);
    }

    sendMail = async (req, res) => {
        let response = {error: false, data: []};

        let encodedRawMail = "";
        try{    
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                if(err){
                    response.error = true;
                }
                else{
                    //creating attachments suitable for transfering via GMail API
                    const attachments = this.parseAttachments(files);
                    encodedRawMail = await this.formatMail(fields, attachments);

                    const oAuth2Client = this.getOAuth2Client();
                    
                    //The message which is sent
                    let sentMessage = {};

                    //get google authentication token from auth user
                    let user = await User.findOne({_id: req.user.id});
                    if(!user){
                        response.error = true;
                    }
                    let googleAuthCode = JSON.parse(user.googleAuth);

                    //check auth code is not empty
                    if(Object.keys(googleAuthCode).length){
                        oAuth2Client.setCredentials(googleAuthCode);

                        if(!fields.saveAsDraft){
                            sentMessage = await GoogleManager.sendMail(encodedRawMail, oAuth2Client);
                        }
                        else{
                            sentMessage = await GoogleManager.saveAsDraft(encodedRawMail, oAuth2Client);
                        }

                    }
                    response.data = sentMessage;
                }
                return res.send(response);
            });
        }
        catch(exp){
            Sentry.captureException(exp);
            logger.error(exp);
            response.error = true;
        }
                
    }

    parseAttachments(files){
        const attachments = [];
        for(let key in files){
            attachments.push({
                filename: files[key].name,
                path: files[key].path,
                encoding: 'base64'
            });
        }
        return attachments;
    }
    
    formatMail = async ({to, from, subject, body, replyTo, references}, attachments = []) => {
        //removing angle brackets from to string
        if(to.includes("<") || to.includes(">")){
            to = to.substring(to.indexOf("<")+1);
            to = to.substring(0, to.indexOf(">"));
        }

        let msg = {
            from,
            to,
            subject,
            html: body,
            replyTo,
            references,
            textEncoding: "base64",
            attachments
        };
        let mail = new MailComposer(msg);

        return new Promise((resolve, reject) => {
            mail.compile().build((err, msg) => {
                if(!err){
                    resolve(new Buffer.from(msg).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));
                }
                else{
                    reject('');
                }
            });
        });
    }

    getOtherContacts = async (req, res) => {
        let response = {error: false, data: []};
        //A List of other contacts i.e contacts which are not in user's connections
        let otherContacts = [];

        try{
            //get oauth2client
            const oAuth2Client = this.getOAuth2Client();
            //get google authentication token from auth user
            let user = await User.findOne({_id: req.user.id});
            if(!user){
                response.error = true;
            }
            let googleAuthCode = JSON.parse(user.googleAuth);

            //check auth code is not empty
            if(Object.keys(googleAuthCode).length){
                oAuth2Client.setCredentials(googleAuthCode);

                otherContacts = await GoogleManager.getOtherContacts(oAuth2Client);
            }
            response.data = otherContacts;
        }
        catch(exp){
            Sentry.captureException(exp);
            logger.error(exp);
            response.error = true;
        }
        
        res.send(response);
    }

    getThreads = async (req, res) => {
        const oAuth2Client = this.getOAuth2Client();
        
        let threads = [];
        //get google authentication token from file
        let googleAuthCode = JSON.parse(await fs.readFile('./gmail_credentials.txt'));

        //check auth code is not empty
        if(Object.keys(googleAuthCode).length){
            oAuth2Client.setCredentials(googleAuthCode);

            threads = await GoogleManager.getThreadsList(oAuth2Client);
        }
        res.send(threads);
    }

    getThreadMessages = async(req, res) => {
        const oAuth2Client = this.getOAuth2Client();
        
        let thread = {};
        //get google authentication token from file
        let googleAuthCode = JSON.parse(await fs.readFile('./gmail_credentials.txt'));

        //check auth code is not empty
        if(Object.keys(googleAuthCode).length){
            oAuth2Client.setCredentials(googleAuthCode);

            thread = await GoogleManager.getThreadMessages(req.params.tid, oAuth2Client);
        }
        res.send(thread);
    }

    restoreMessage = async(req, res) => {
        let response = {error: false, data: {}};
        let params = {
            id: req.params.mid,
            addLabelIds: req.body.addLabelIds,
            removeLabelIds: req.body.removeLabelIds
        };

        try{
            const oAuth2Client = this.getOAuth2Client();

            //The message whose label is modified
            let msg = {};

            //get google authentication token from auth user
            let user = await User.findOne({_id: req.user.id});
            if(!user){
                response.error = true;
            }
            let googleAuthCode = JSON.parse(user.googleAuth);

            //check auth code is not empty
            if(Object.keys(googleAuthCode).length){
                oAuth2Client.setCredentials(googleAuthCode);

                msg = await GoogleManager.modifyLabels(params, oAuth2Client);
            }
            response.data = msg;
        }
        catch(exp){
            Sentry.captureException(exp);
            logger.error(exp);
            response.error = true;
        }
        res.send(msg);
    }

    getLabels = async (req, res) => {
        let response = {error: false, data: []};
        let oAuth2Client = this.getOAuth2Client();

        //Gmail Labels
        let labels = [];
        try{
            //get google authentication token from auth user
            let user = await User.findOne({_id: req.user.id});
            if(!user){
                response.error = true;
            }
            else{
                let googleAuthCode = JSON.parse(user.googleAuth);

                //check auth code is not empty
                if(Object.keys(googleAuthCode).length){
                    oAuth2Client.setCredentials(googleAuthCode);

                    labels = await GoogleManager.getLabels(oAuth2Client);
                }
            }
            response.data = labels;
        }
        catch(e){
            Sentry.captureException(e);
            logger.error(`Error while fetching labels : ${e}`);
            response.error = true;
        }
        
        res.send(response);
    }

    addLabels = async (req, res) => {
        let response = {error: false, data: []};
        let oAuth2Client = this.getOAuth2Client();

        //Newly created gmail label
        let label = {};
        try{
            //get google authentication token from auth user
            let user = await User.findOne({_id: req.user.id});
            if(!user){
                response.error = true;
            }
            else{
                let googleAuthCode = JSON.parse(user.googleAuth);

                //check auth code is not empty
                if(Object.keys(googleAuthCode).length){
                    oAuth2Client.setCredentials(googleAuthCode);

                    label = await GoogleManager.addLabels(req.body, oAuth2Client);
                }
            }
            response.data = label;
        }
        catch(e){
            Sentry.captureException(e);
            logger.error(`Error while creating a new user label : ${e}`);
            response.error = true;
        }
        
        res.send(response);
    }

    getMessageDetails = async (req, res) =>{
        let response = {error: false, data: null};
        let messageId = req.params.mid;
        //an object that will contact a single message details
        try{
            //get Oauth2client instance
            const oAuth2Client = this.getOAuth2Client();
            let user = await User.findOne({_id: req.user.id});
            if(!user){
                response.error = true;
            }
            else{
                //get google authentication token from user
                let googleAuthCode = JSON.parse(user.googleAuth);

                //check auth code is not empty
                if(Object.keys(googleAuthCode).length){
                    oAuth2Client.setCredentials(googleAuthCode);
                    //getting the whole message with headers and body
                    let mail_detail = await GoogleManager.getSingleProcessedMessageDetails(oAuth2Client, messageId);
                    //let message_Id = mail_detail.payload.headers.find(obj => obj.name == "Message-ID")
                    //fetch attachments if message has any    
                    if(mail_detail.decoded_attachments && mail_detail.decoded_attachments.length)
                    {
                        let i = 0
                        for (let attachment of mail_detail.decoded_attachments)
                        {
                            let attachment_data = await GoogleManager.attachmentData(oAuth2Client, messageId, attachment);
                            mail_detail.decoded_attachments[i].attachment_data = attachment_data;
                            i++;
                        }
                    }

                    response.data = mail_detail;
                }
            }
        }
        catch(exp){
            Sentry.captureException(exp);
            logger.error(`Error while fetching message details : ${exp}`);
            response.error = true;
        }

        res.send(response);
    }

    deleteAccount = async(req, res) => {
        let response = {error: false, message: ''};
        
        try{
            const {email, isDelete} = req.query;    
            if(isDelete == "true"){
                let user = await User.findOne({email});
                if(user){
                    const oAuth2Client = this.getOAuth2Client();
                    let googleAuthCode = JSON.parse(user.googleAuth);

                    //check auth code is not empty
                    if(Object.keys(googleAuthCode).length){
                        oAuth2Client.setCredentials(googleAuthCode);
                        //revokes the google token and deletes user from database
                        response.message = await GoogleManager.revokeToken({oAuth2Client, user});
                    }
                    
                }
                else{
                    response.message ="User with given email address not found";
                }
            }
        }
        catch(e){
            Sentry.captureException(e);
            response.message = "Server Error";
            response.error = true;
            logger.error(e);
        }
        res.send(response);
    }
}


module.exports = new GmailController();