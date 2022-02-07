/*
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
*/

const userDefaults = {
    name : "",
    email: "",
    profilePicUrl: "",
    //role: "",
    //googleEmail: "",
    token: null,
    hasGoogleAuth: false,
    isAuthenticated: false
}

/*const googleDefaults = {
    apiKey: 'AIzaSyCXoNyOsBfvCk3GNuuEXfYmz3hJvwwZ_3k',
    discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1", 
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],

    clientId: '417728105098-urn8v0e481l1mthrs3i3ltn1jumpejsk.apps.googleusercontent.com',
    scopes: 'profile https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/contacts.other.readonly',
    isSignedIn: false
}*/

export default{
    setInitialDone: false,
    //googleCreds: googleDefaults,
    appActiveUser: userDefaults,
    //code: '',
    replyMailEntity: {
        to: null,
        from: null,
        subject: null,
        messageID: null,
        replyBody: null
    },
    //Key codes values for control or functional keys
    keyCodes:{
        backspace: 8,
        tab: 9,
        enter: 13,
        shift: 16,
        ctrl: 17,
        alt: 18,
        'pause/break': 19,
        'caps-lock': 20,
        escape: 27,
        space: 32,
        'page-up': 33,
        'page-down': 34,
        end: 35,
        home: 36,
        arrows:{
            left: 37,
            up: 38,
            right: 39,
            down: 40,
        },
        insert: 45,
        delete: 46
    },
    labelName: '',
    lastActiveRoute: '',
    searchKey: '',
    /**an array containing result objects based on search key
     * result object can be an instance of message or a contact
     */
    searchResults: [],
    // an array of search result selected by user based on filters
    selectedSearchResult: [],
    // Advanced Search Params
    advancedSearchParams: {
        from: '',
        to: '',
        subject: '',
        wordsIncluded: '',
        wordsExcluded: '',
        size: {
            comparisonLevel: '',
            value: '',
            unit: ''
        },
        dateRange: {
            from: '',
            within: ''
        },
        searchIn: '',
        hasAttachment: false
    },

    //advance search result
    advanceSearchResult: []
}