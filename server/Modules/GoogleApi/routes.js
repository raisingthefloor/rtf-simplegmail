const { gmail } = require('googleapis/build/src/apis/gmail');
const gmailController = require('./Controllers/gmail.controller');
const authController = require('./Controllers/auth.controller');
const {validateToken} = require('./Middlewares/validateToken');

module.exports = router => {
    router.get('/connect', validateToken, gmailController.apiConnect);
    router.post('/googlecallback', validateToken, gmailController.apiGoogleCallback);
    router.get('/users/:id/messages/:type', gmailController.getMails);
    router.get('/users/:id/contacts', gmailController.getAllContacts);
    router.post('/users/:uid/messages/:mid/trash', gmailController.trashMessage);
    router.post('/users/:uid/messages/:mid/untrash', gmailController.deleteFromTrash);
    router.post('/users/:uid/messages/send', gmailController.sendMail);

    router.get('/users/:uid/contacts/other', gmailController.getOtherContacts);
    router.get('/users/:uid/threads', gmailController.getThreads);

    router.get('/users/:uid/thread/:tid/messages', gmailController.getThreadMessages);
    router.post('/users/:uid/messages/:mid/restore', gmailController.restoreMessage);

    //Authentication routes
    router.post('/users/register', authController.registerUser);
    router.post('/users/login', authController.userLogin);
}