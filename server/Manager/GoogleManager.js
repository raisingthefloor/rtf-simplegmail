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

const {google} = require('googleapis');
const logger = require('../logger');

exports.getToken = async function (code) {
    return new Promise((resolve, reject) => {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
        const {client_secret, client_id, redirect_uris} = credentials.web
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[4]);
        oAuth2Client.getToken(code, (err, token) => {

            if (err) return logger.error('Error retrieving access token', err);

            //oAuth2Client.setCredentials(token)
            resolve(token)
        });
    })
}


exports.getUserProfile = async function (auth) {
    return new Promise((resolve, reject) => {
        //Instantiate the google's people service object
        const peopleService = google.people({version: 'v1', auth});

        peopleService.people.get({
            resourceName: 'people/me',
            personFields: 'names,emailAddresses',
        }, (err, res) => {
            if (err) return logger.error('The API returned an error: ' + err + 'Error while fetching profile');
            else resolve(res.data);
        })
    })
}

//get processed message details for single message
exports.getSingleProcessedMessageDetails = async function (auth, messageId) {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth})
        gmail.users.messages.get({
            userId: 'me',
            id: messageId
        }, (err, res) => {
            if (err) return logger.error('The API returned an error: ' + err + ' and Message ID: ' + message.id)

            let mail_data = res.data
            let headers = mail_data.payload.headers

            //console.log("mail_data", mail_data)

            if(mail_data.payload.mimeType == "multipart/mixed")
            {
                //console.log("mail data3", mail_data)
                let messageId = headers.find(obj => obj.name == "Message-ID")
                let mail_data_alternative = mail_data.payload.parts.find(x => x.mimeType == "multipart/alternative")
                if(mail_data_alternative)
                {
                    /*console.log("mail_data.payload", mail_data.payload)
                    console.log("mail_data.payload.parts", mail_data.payload.parts)
                    console.log("message part", mail_data_alternative)
                    console.log("message part data", mail_data.payload)*/
                    let html_part = mail_data_alternative.parts.find(y => y.mimeType == "text/html")
                    let buff = new Buffer.from(html_part.body.data, 'base64')
                    let text = buff.toString('utf8')
                    let attachments = mail_data.payload.parts.filter(obj => obj.mimeType != "multipart/alternative")
                    mail_data.decoded_attachments = attachments

                    mail_data.decoded_body = []
                    mail_data.decoded_body[0] = text
                }

                let mail_data_related = mail_data.payload.parts.find(x => x.mimeType == "multipart/related")
                if (mail_data_related)
                {
                    let buff = new Buffer.from(textHtml.body.data, 'base64')
                    let text = buff.toString('utf8');
                    mail_data.decoded_body = []
                    mail_data.decoded_body[0] = text
                }

                /*if(text.includes("</body>"))
                {
                    //<body> exists
                    exports.attachmentHTML(auth, messageId, attachments)
                        .then((att_html) => {
                            att_html.html += "</body>"
                            text = text.replace("</body>", att_html)
                            mail_data.decoded_body = []
                            mail_data.decoded_body[0] = text
                            mail_data.decoded_a = []
                            mail_data.decoded_a = att_html.decoded_attachment
                        })
                }
                else
                {
                    //<body> does not exists
                    exports.attachmentHTML(auth, messageId, attachments).then((att_html) => {
                        text += att_html.html
                        mail_data.decoded_body = []
                        mail_data.decoded_body[0] = text
                        mail_data.decoded_a = []
                        mail_data.decoded_a = att_html.decoded_attachment
                    })
                }*/
            }
            else if (mail_data.payload.mimeType == "multipart/alternative")
            {
                //console.log("mail data2", mail_data)
                if(mail_data.payload.body.data)
                {
                    let buff = new Buffer.from(mail_data.payload.body.data, 'base64')
                    let text = buff.toString('utf8');
                    mail_data.decoded_body = []
                    mail_data.decoded_body[0] = text
                }
                if(mail_data.payload.parts)
                {
                    let obj = mail_data.payload.parts.find(x => x.mimeType === 'text/html')
                    if(obj){
                        let buff = new Buffer.from(obj.body.data, 'base64');
                        let text = buff.toString('utf8');
                        mail_data.decoded_parts = []
                        mail_data.decoded_parts[0] = text
                    }
                }
            }
            else if (mail_data.payload.mimeType == "text/html")
            {
                let buff = new Buffer.from(mail_data.payload.body.data, 'base64')
                let text = buff.toString('utf8');
                mail_data.decoded_body = []
                mail_data.decoded_body[0] = text
                //console.log("mail data", mail_data)
            }
            else if (mail_data.payload.mimeType == "multipart/related")
            {
                //check if alternative
                let multipartAlternative = mail_data.payload.parts.find(obj => obj.mimeType == "multipart/alternative")
                if(multipartAlternative)
                {
                    if(multipartAlternative.body.data)
                    {
                        let buff = new Buffer.from(multipartAlternative.body.data, 'base64')
                        let text = buff.toString('utf8');
                        mail_data.decoded_body = []
                        mail_data.decoded_body[0] = text
                    }
                    if(multipartAlternative.parts)
                    {
                        let obj = multipartAlternative.parts.find(x => x.mimeType === 'text/html')
                        let buff = new Buffer.from(obj.body.data, 'base64');
                        let text = buff.toString('utf8');
                        mail_data.decoded_parts = []
                        mail_data.decoded_parts[0] = text
                    }
                }

                //check if text/html
                let textHtml = mail_data.payload.parts.find(obj => obj.mimeType == "text/html")
                if(textHtml)
                {
                    let buff = new Buffer.from(textHtml.body.data, 'base64')
                    let text = buff.toString('utf8');
                    mail_data.decoded_body = []
                    mail_data.decoded_body[0] = text
                }


                /*let attachments = mail_data.payload.parts.filter(obj => (obj.mimeType == "image/jpeg" || obj.mimeType == "image/png"))
                //mail_data.decoded_attachments = attachments

                mail_data.decoded_related_images = attachments


                console.log("decoded_attachments", attachments.length)*/

                /*for (let i = 0; i < mail_data.payload.parts.length; i++)
                {

                }*/
                /*if(mail_data.payload.parts)
                {
                    console.log("mail parts", mail_data.payload.parts[0])
                    console.log("mail parts", mail_data.payload.parts[1])

                }*/
            }

            resolve(mail_data)
        })
    })
}

//gets all the unread messages
/**
 * args OAuth2Client instance, an array of string labelIds
 */
exports.getMessages = async function (auth, labelIds, pageToken) {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth})

        gmail.users.messages.list({
            userId: 'me',
            labelIds: labelIds,
            maxResults: 10,
            pageToken,
            includeSpamTrash: false
        }, (err, res) => {
            if (err){
                logger.error('The API returned an error: ' + err);
                reject([]);
                throw err;
            } 
            //console.log("res.data.messages", res)
            if(res.data && res.data.messages)
            {
                resolve({messages:res.data.messages, nextPageToken: res.data.nextPageToken ?? null});
            }
            else
            {
                resolve([]);
            }
        })

    })
}

//list all connections of authenticated  user (saved contacts)
exports.listAllConnections = async auth => {
    return new Promise((resolve, reject) => {
        //Instantiate the google's people service object
        const peopleService = google.people({version: 'v1', auth});
        
        peopleService.people.connections.list({
            resourceName: 'people/me',
            pageSize: 10,
            personFields: 'names,emailAddresses,phoneNumbers,photos',
        }, (err, res) => {
            if (err) return logger.error('The API returned an error: ' + err);

            const connections = res.data.connections;
            resolve(connections);           
        });
    });    
} 

//get other contacts that are auto generated during email interactions
exports.getOtherContacts = async auth => {
    return new Promise((resolve, reject) => {
        //Instantiate the google's people service object
        const peopleService = google.people({version: 'v1', auth});

        peopleService.otherContacts.list({
            pageSize: 10,
            readMask: 'names,emailAddresses,photos'
        }, (err, res) => {
            if(err) return logger.error('The API returned an error: '+ err);

            let contacts = [];
            if(res.data.otherContacts) contacts = res.data.otherContacts;
            resolve(contacts);
        });
    });
}

//get catgeory/groups to which contacts belong
exports.getContactGroups = async auth => {
    return new Promise((resolve, reject) => {
        //Instantiate the google's people service object
        const peopleService = google.people({version: 'v1', auth});
        
        peopleService.contactGroups.list({
            //resourceName: 'people/me',
            pageSize: 10,
            //personFields: 'names,emailAddresses',
        }, (err, res) => {
            if (err) return logger.error('The API returned an error: ' + err);
            //console.log(res.data);
            resolve([]);
        });
    });    
}

//moves a mesage to trash box
exports.trashMessage = async (message, auth) => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth});

        gmail.users.messages.trash(message, (err, res) => {
            if(!err){
                resolve(res.data);
            }
            else{
                reject([]);
            }
        });
    });
}

//Permanently deletes a mesage
exports.deleteFromTrash = async (message, auth) => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth});

        gmail.users.messages.untrash(message, (err, res) => {
            if(!err){
                resolve(res.data);
            }
            else{
                reject([]);
            }
        });
    });
}

//sends a mail to another account
//raw contains message body encoded as base64 string
exports.sendMail = async(raw, auth) => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.messages.send({
            userId: 'me',
            resource: {
                raw: raw
            }
        }, (err, res) => {
            if(!err){
                resolve(res.data);
            }
            else{
                logger.error(err);
                reject({});
            }
        });
    });
}

//saves a raw message as draft
exports.saveAsDraft = async (raw, auth) => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.drafts.create({
            userId: 'me',
            resource: {
                message:{
                    raw
                }
            }
        }, (err, res) => {
            if(!err){
                resolve(res.data);
            }
            else{
                logger.error(err);
                reject({});
            }
        });
    });
};

//get threads list of authenticated user
exports.getThreadsList = async auth => {
    return new Promise((resolve, reject) => {{
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.threads.list({
            userId: 'me',
            includeSpamTrash: false
        }, (err, res) => {
            if(!err){
                resolve(res.data);
            }
            else{
                reject([]);
            }
        });
    }});
}

exports.getThreadMessages = async (threadId, auth) => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.threads.get({
            userId: 'me',
            id: threadId
        }, (err, res) => {
            if(!err){
                resolve(res.data);
            }
            else{
                reject([]);
            }
        });       
    });
}

exports.modifyLabels = async (params, auth) => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth});
        const {id, addLabelIds, removeLabelIds} = params;
        gmail.users.messages.modify({
            userId: 'me',
            id,
            resource:{
                addLabelIds,
                removeLabelIds
            }
        }, (err, res) => {
            if(!err){
                resolve(res.data);
            }
            else{
                logger.error('The API returened with error: ', err);
                reject({});
            }
        });  
    });
}

//Get Labels from Gmail Server
exports.getLabels = async auth => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.labels.list({
            userId: 'me'
        }, (err, res) => {
            if(!err){
                resolve(res.data.labels);
            }
            else{
                logger.error('The API returened with error: ', err);
                reject([]);
            }
        });  
    });
}

//Creates a new user defined label on Gmail Server
exports.addLabels = async (labelOptions, auth) => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.labels.create({
            userId: 'me',
            resource: labelOptions
        }, (err, res) => {
            if(!err){
                //console.log(res.data)
                resolve(res.data);
            }
            else{
                logger.error('The API returened with error: ', err);
                reject([]);
            }
        });  
    });
}

//fetches attachment from Gmail Server
exports.attachmentData = async function (auth, messageId, attachment) {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth})
        gmail.users.messages.attachments.get({
            userId: 'me',
            messageId: messageId,
            id: attachment.body.attachmentId
        }, (err, res) => {
            if(!err) resolve(res.data);
            else return logger.error(`Error while fetching attachment : ${err}`);            
        })
    })
}

exports.revokeToken = async({oAuth2Client, user}) => {
    let token = oAuth2Client.credentials.refresh_token;
    return new Promise((resolve, reject) => {
        oAuth2Client.revokeToken(token, function(err, body) {
            if(!err){
                //console.log(body);
                user.delete();
                resolve('Email Removed Successfully');
            }
            else{
                logger.error(`Error while revoking token : ${err}`);
                reject('Error while revoking token');
            }
        });
    });
}

exports.getSingleMessageMetadata = async (auth, messageId) => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'metadata',
            metadataHeaders: ['From', 'To', 'Subject', 'Date']
        }, (err, res) => {
            if(err){
                logger.error(`Error while fetching message metadata : ${err}`);
                reject({});
            }
            else{
                resolve(res.data);
            }
        });               
    });
}