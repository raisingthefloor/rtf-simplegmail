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

//const { gmail } = require('googleapis/build/src/apis/gmail');
const gmailController = require('./Controllers/gmail.controller');
const authController = require('./Controllers/auth.controller');
const {validateToken} = require('./Middlewares/validateToken');

module.exports = router => {
    //router.get('/connect', validateToken, gmailController.apiConnect);
    router.post('/googlecallback', gmailController.googleCallback);
    router.get('/users/:id/messages/:type', validateToken, gmailController.getMails);
    router.get('/users/:id/contacts', validateToken, gmailController.getAllContacts);
    router.post('/users/:uid/messages/:mid/trash', validateToken, gmailController.trashMessage);
    router.post('/users/:uid/messages/:mid/untrash', validateToken, gmailController.deleteFromTrash);
    router.post('/users/:uid/messages/send', validateToken, gmailController.sendMail);
    router.post('/users/:uid/messages/:mid/restore', validateToken, gmailController.restoreMessage);

    router.get('/users/:uid/contacts/other', validateToken, gmailController.getOtherContacts);
    router.get('/users/:uid/threads', gmailController.getThreads);

    router.get('/users/:uid/thread/:tid/messages', gmailController.getThreadMessages);
    router.get('/users/:uid/labels', validateToken, gmailController.getLabels);
    router.post('/users/:uid/labels/add', validateToken, gmailController.addLabels);
    
    router.get('/connect', gmailController.googleConnect);
    //Authentication routes
    router.post('/users/register', authController.registerUser);
    router.post('/users/login', authController.userLogin);
    router.post('/users/store', authController.storeGoogleCreds);

    router.post('/users/google/status', authController.checkGoogleStatus);
}