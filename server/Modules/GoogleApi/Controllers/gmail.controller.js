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
const fs = require('fs/promises');
const formidable = require('formidable');
const MailComposer = require("nodemailer/lib/mail-composer");
const User = require("../Models/User");


//Controller definition
class GmailController{
    SCOPES = ['https://www.googleapis.com/auth/gmail.modify', 'https://mail.google.com/',
        'https://www.googleapis.com/auth/contacts', 'https://www.googleapis.com/auth/contacts.other.readonly'];
    //methods to handle requests
    /**
     * @route GET /api/connect
     * @desc connects with googleapis 
     * @access shoould be private
     */
    apiConnect = async (req, res) => {
        let response = {
            error: false,
            data: {}
        }
        let generateURL = false;
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
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
            generateURL = true;
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
    }

    apiGoogleCallback = async (req, res) => {
        const token = await GoogleManager.getToken(req.body.code);
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const {client_secret, client_id, redirect_uris} = credentials.web;
        let oAuth2Client = "", userProfile = {}, response = {error: false, data:{}};
        if(token){
            oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0])
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
    }

    getMails = async (req, res) => {
        let response = {error: false, data: []};

        let labelIds = [req.params.type.toUpperCase()];
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        let allMailDetails = [];
        let user = await User.findOne({_id: req.user.id});
        if(!user){
            response.error = true;
        }

        //get google authentication token from user
        let googleAuthCode = JSON.parse(user.googleAuth);
        //check auth code is not empty
        if(Object.keys(googleAuthCode).length){
            oAuth2Client.setCredentials(googleAuthCode);
            oAuth2Client.currentClassPointer = this;

            const gmail = google.gmail({version: 'v1', oAuth2Client});
            
            let allMails = await GoogleManager.getMessages(oAuth2Client, labelIds);
            
            //console.log("allUnreadMails", allUnreadMails)
            for (let mail of allMails)
            {
                let mail_detail = await GoogleManager.getSingleProcessedMessageDetails(oAuth2Client, mail)
                //console.log("getSingleProcessedMessageDetails", mail_detail)
                let messageId = mail_detail.payload.headers.find(obj => obj.name == "Message-ID")
                if(mail_detail.decoded_attachments && mail_detail.decoded_attachments.length)
                {
                    let i = 0
                    for (let attachment of mail_detail.decoded_attachments)
                    {
                        let attachment_data = await GoogleManager.attachmentData(oAuth2Client, messageId, attachment)
                        mail_detail.decoded_attachments[i].attachment_data = attachment_data
                        i++
                    }
                }

                /*console.log("decoded_related_images", mail_detail.decoded_related_images)
                console.log("datatype ", mail_detail.decoded_related_images, typeof mail_detail.decoded_related_images, Array.isArray(mail_detail.decoded_related_images))*/
                //console.log("decoded_attachments1", mail_detail.decoded_related_images.length)
                /*if (mail_detail.decoded_related_images)
                {
                    for (let attachment of mail_detail.decoded_attachments)
                    {
                        console.log("attachment", attachment)
                        let attachment_data = await GoogleManager.attachmentData(oAuth2Client, messageId, attachment)
                        mail_detail.decoded_related_images[i].attachment_data = attachment_data
                    }
                }*/

                /*for (let j = 0; j < mail_detail.decoded_related_images.length; j++)
                {
                    let attachment_data = await GoogleManager.attachmentData(oAuth2Client, messageId, mail_detail.decoded_related_images[j])
                    mail_detail.decoded_related_images[j].attachment_data = attachment_data
                    mail_detail.decoded_related_images[j].content_id = mail_detail.decoded_related_images[j].headers.find(obj => obj.name == "X-Attachment-Id").value
                    //console.log("now", mail_detail.decoded_related_images[j])
                }*/

                allMailDetails.push(mail_detail)
            }
            response.data = allMailDetails;
        }

    res.send(response);
    }

    getAllContacts = async (req, res) => {
        let response = {error: false, data: []};

        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
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
        res.send(response);
    }

    trashMessage = async (req, res) => {
        let response = {error: false, data: []};

        //the message object representing the message that is to be trashed
        let message = {userId : req.params.uid, id: req.params.mid};

        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        //using OAuthClient object for authentication and authorization
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        
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
        res.send(response);
    }

    deleteFromTrash = async(req, res) => {
        let response = {error: false, data: []};

        //the message object representing the message that is to be removed from trash
        let message = {userId : req.params.uid, id: req.params.mid};

        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        //using OAuthClient object for authentication and authorization
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        
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
        res.send(response);
    }

    sendMail = async (req, res) => {
        let response = {error: false, data: []};

        let encodedRawMail = "";
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            //creating attachments suitable for transfering via GMail API
            const attachments = this.parseAttachments(files);
            encodedRawMail = await this.formatMail(fields, attachments);

            let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
            const {client_secret, client_id, redirect_uris} = credentials.web
            //using OAuthClient object for authentication and authorization
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);
            
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
            res.send(response);
        });
        
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

        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const {client_secret, client_id, redirect_uris} = credentials.web;
        //using OAuthClient object for authentication and authorization
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        
        let otherContacts = [];

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
        res.send(response);

    }

    getThreads = async (req, res) => {
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web;
        //using OAuthClient object for authentication and authorization
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        
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
        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web;
        //using OAuthClient object for authentication and authorization
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        
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
        let params = {
            id: req.params.mid,
            addLabelIds: req.body.addLabelIds,
            removeLabelIds: req.body.removeLabelIds
        };

        let credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const {client_secret, client_id, redirect_uris} = credentials.web;
        //using OAuthClient object for authentication and authorization
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

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
        res.send(msg);

    }
}


module.exports = new GmailController();