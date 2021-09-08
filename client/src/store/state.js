const userDefaults = {
    name : "",
    email: "",
    //role: "",
    //googleEmail: "",
    token: null,
    hasGoogleAuth: false,
    isAuthenticated: false
}

export default{
    setInitialDone: false,
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