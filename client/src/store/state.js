const userDefaults = {
    name : "",
    email: "",
    //role: "",
    //googleEmail: "",
    token: null,
    hasGoogleAuth: false,
    isAuthenticated: false
}

const googleDefaults = {
    apiKey: 'AIzaSyCXoNyOsBfvCk3GNuuEXfYmz3hJvwwZ_3k',
    discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1", 
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],

    clientId: '417728105098-urn8v0e481l1mthrs3i3ltn1jumpejsk.apps.googleusercontent.com',
    scopes: 'profile https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify',
    isSignedIn: false
}

export default{
    setInitialDone: false,
    googleCreds: googleDefaults,
    user:{
        name: 'Mayur Prakash Upadhayay',
        email: 'mayur@raisingthefloor.org'
    },
    appActiveUser: userDefaults,
    code: '',
    replyMailEntity: {
        to: null,
        from: null,
        subject: null,
        messageID: null,
        replyBody: null
    }
}