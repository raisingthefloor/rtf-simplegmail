<!--
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
-->

<template>
    <div>
        <div class="common-area">
                <div class="common__left">
                    <div class="common__mail__wrapper">
                        <div class="mail__details__blk position-relative">
                            <div class="mail__details__left mail--write--input">
                                <div class="int--blk">
                                    <p>TO:</p>
                                    <div class="mail__write__input__field dropdown-container">

                                        <!--Selected Recipients-->
                                        <div style="display:inline-block" v-if="mailInputArray.to.length">
                                            <span v-for="(contact,index) in mailInputArray.to" :key="index">
                                                <span @click="removeFromMailInputArray('to', contact.etag)" v-if="contact.names" class="cursor-pointer badge rounded-pill bg-secondary"
                                                title="Click to Remove"
                                                >
                                                    {{contact.names[0]?.displayName}} x
                                                </span>

                                                <span v-else-if="contact.emailAddresses" @click="removeFromMailInputArray('to', contact.etag)" class="badge rounded-pill bg-secondary cursor-pointer" title="Click to Remove"
                                                >
                                                    {{contact.emailAddresses[0]?.value}} x
                                                </span>&nbsp;
                                            </span>
                                        </div>

                                        <!--To input field-->
                                        <input name="to" id="to" v-model="mailInputs.to" type="text" 
                                            @keyup="onKeyUp"
                                            @keydown="onKeyDown" 
                                            @focus="setLastFocus"
                                        />

                                        <!--Contact Result dropdown for to field-->
                                        <div v-if="searchedContacts.length" class="dropdown-content">
                                            <div @click="contactSelected($event, 'to', index)" 
                                            :class="['user-profile', index == currentIndex ? 'selected' : '']" v-for="(contact, index) in searchedContacts" :key="contact.etag" :ref="`to_${index}`"
                                            >
                                                <div class="user-avatar">
                                                    <a href="javascript:void(0)"> 
                                                        <img :src="contact.photos[0]?.url" alt="profile">
                                                    </a>
                                                </div>
                                                <div class="user-creds">
                                                    <div class="user-name" v-if="contact.names">{{contact.names[0].displayName}}</div>
                                                    <div class="user-email" v-if="contact.emailAddresses">{{contact.emailAddresses[0].value}}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <!-- <div class="int--blk">
                                    <p>From:</p>
                                    <div class="mail__write__input__field">
                                        <input name="from" id="from" v-model="mail.from" type="text">
                                    </div>
                                </div> -->
                                <div class="int--blk">
                                    <p>Send a copy to:</p>
                                    <div class="mail__write__input__field dropdown-container">
                                        <!--Selected CC Recipients-->
                                        <div style="display:inline-block" v-if="mailInputArray.cc.length">
                                            <span v-for="(contact,index) in mailInputArray.cc" :key="index">
                                                <span @click="removeFromMailInputArray('cc', contact.etag)" v-if="contact.names" class="cursor-pointer badge rounded-pill bg-secondary">
                                                    {{contact.names[0]?.displayName}} x
                                                </span>

                                                <span v-else-if="contact.emailAddresses" @click="removeFromMailInputArray('cc', contact.etag)" class="badge rounded-pill bg-secondary cursor-pointer">
                                                    {{contact.emailAddresses[0]?.value}} x
                                                </span>&nbsp;
                                            </span>
                                        </div>

                                        <!--CC input field-->
                                        <input name="cc" id="cc" v-model="mailInputs.cc" type="text" 
                                            @keyup="onKeyUp" 
                                            @keydown="onKeyDown" 
                                            @focus="setLastFocus"
                                        />

                                        <!--Contact Result dropdown for to field-->
                                        <div v-if="searchedContacts.length" class="dropdown-content">
                                            <div @click="contactSelected($event, 'cc', index)" :class="['user-profile', index == currentIndex ? 'selected' : '']" v-for="(contact,index) in searchedContacts" :key="contact.etag">
                                                <div class="user-avatar">
                                                    <a href="javascript:void(0)"> 
                                                        <img :src="contact.photos[0]?.url" alt="profile">
                                                    </a>
                                                </div>
                                                <div class="user-creds">
                                                    <div class="user-name" v-if="contact.names">{{contact.names[0].displayName}}</div>
                                                    <div class="user-email" v-if="contact.emailAddresses">{{contact.emailAddresses[0].value}}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="int--blk">
                                    <p>Subject:</p>
                                    <div class="mail__write__input__field">
                                        <input name="subject" id="subject" v-model="mail.subject" type="text">
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="mail__details__right">
                                <div class="mail__time">
                                    <p>1/19/20 8:30am</p>
                                </div>
                            </div> -->
                            <div class="mail__close" title="Close" @click="resetMail">
                                <i class="far fa-times"></i>
                            </div>
                        </div>
                        <!-- <div class="common__mail__body">
                            <textarea v-model="mail.body" name="mail.body" id="body"></textarea>
                        </div> -->
                        <div class="compose-editor">
                            <div id="editor">
                                
                            </div>
                            <div class="attachment-container" v-if="mail.attachments.length">
                                <p v-for="(attachment, index) in mail.attachments" :key="index" class="attachment position-relative">
                                    {{attachment.name}} (<span style="color:#777">{{Math.round(attachment.size / 1000)}}K</span>)
                                    <span class="attachment-remove" title="Remove Attachment" @click="attachmentRemove(index)">x</span>
                                </p>
                            </div>
                        </div>
                        <div class="common__mail__bottom d-flex">
                            <div class="dropdown mail__more__option ">
                                <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="far fa-ellipsis-v"></i>
                                </a>

                                <ul class="dropdown-menu dropdown-menu-start" aria-labelledby="dropdownMenuLink">
                                    <li><a class="dropdown-item" href="#">Plain Text Mode (/Rich Text Mode) X
                                        </a></li>
                                    <li><a class="dropdown-item" href="#"> Label ></a></li>
                                    <li><a class="dropdown-item" href="#">Print</a></li>
                                    <li><a class="dropdown-item" href="#">Check Spelling
                                        </a></li>
                                    <li><a class="dropdown-item" href="#">-------------------
                                        </a></li>
                                    <li><a class="dropdown-item" href="#">Insert Photo
                                        </a></li>
                                    <li><a class="dropdown-item" href="#">Insert files using Drive
                                        </a></li>
                                    <li><a class="dropdown-item" href="#">Insert Link
                                        </a></li>
                                    <li><a class="dropdown-item" href="#">Insert Signature
                                        </a></li>
                                    <li><a class="dropdown-item" href="#">--------------------
                                        </a></li>
                                    <li><a class="dropdown-item" href="#">Turn Confidential Mode on/Off
                                        </a></li>
                                    <li><a class="dropdown-item" href="#">Smart Compose Feedback
                                        </a></li>
                                </ul>
                            </div>
                            <div class="mail__bottom__actions">
                                <div class="mail__bottom__action">
                                    <a href="#"><span><img src="/assets/img/format.png" alt=""></span></a>
                                </div>
                                <div class="mail__bottom__action attach--file" title="Add Attachments">
                                    <input type="file" multiple @change="attachmentSelected" tabindex="-1" />
                                    <a href="#"><span><img src="/assets/img/attach.png" alt="file_attachments"></span></a>
                                </div>
                                <div class="mail__bottom__action">
                                    <a href="#"><span><img src="/assets/img/emoji.png" alt=""></span></a>
                                </div>
                            </div>
                            <div class="mail__bottom__btns">
                                <button type="button" :disabled="sendMailDisabled" @click="sendMail(null)"
                                    :class="['common__btn', sendMailDisabled ? 'disabled-btn' : '']">
                                    Send
                                </button>
                                <!--Calling send mail with saveAsDraft as true-->
                                <button type="button" class="common__btn" @click="sendMail(true)">Save as Draft</button>
                                <button type="button" class="common__btn">Print</button>
                                <button type="button" class="common__btn trash--btn"><span><img
                                            src="/assets/img/trash-1.png" alt=""></span><b>Put in TRASH</b></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="common__address__right">
                    <div class="show__address__book">
                        <router-link to="/address-book">
                            <span><i class="fal fa-address-book"></i></span>Show Full Address Book
                        </router-link>
                    </div>
                    <div class="used__addresses">
                        <div class="used__address__top">
                            <span><img src="/assets/img/book.png" alt=""></span>
                            <h6>Commonly Used Addresses </h6>
                        </div>
                        <div class="used__adresses__item" v-if="otherContacts.length">
                            <a href="javascript:void(0)" style="display:block;text-decoration:none" v-for="contact in otherContacts" :key="contact.etag" class="address__item" @mousedown="pushToActiveFields(contact)">
                                {{contact.names ? contact.names[0].displayName : contact.emailAddresses[0].value}}     
                            </a>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
import Quill from 'quill';
import * as Sentry from "@sentry/vue";
import {mapState} from "vuex";

export default {
    name: 'MailComposer',

    data(){
        return{
            moment: moment,
            mail:{
                to: null,
                from: this.$store.state.user.name + ' <'+this.$store.state.user.email+'>',
                cc: null,
                subject: null,
                body: null,
                replyBody: null,
                replyTo: null,
                references: null,
                attachments: []
                //date: Date.now()
            },
            mailInputs:{
                to: '',
                cc: ''
            },
            mailInputArray:{
                to: [],
                cc: []
            },
            otherContacts: [],
            searchedContacts: [],
            inputIds: ['to', 'cc'],
            lastFocused: null,
            currentIndex: 0
        }
    },

    mounted(){
        //is a replyTo mail
        if(this.$route.query.isReply){
            this.prepareMailObject();
        }
        //redirect from address book with to field
        if(this.$route.query.toAddress){
            this.mail.to = this.$route.query.toAddress;
        }
        this.getOtherContacts();
        this.initQuillEditor();
    },

    computed:{
        sendMailDisabled(){
            if(this.mailInputArray.to.length && this.mail.from && this.mail.subject && this.mail.body){
                return false;
            }
            return true;
        },

        ...mapState(['keyCodes']),

        /*searchedContacts(){
            return this.otherContacts.filter(contact => {
                if(this.mail.to){
                    return (contact.names[0].displayName.toLowerCase().includes(this.mail.to.toLowerCase())
                    || contact.emailAddresses[0].value.toLowerCase().includes(this.mail.to.toLowerCase()));
                }
                return true;
            });
        }*/
    },

    methods:{
        sendMail(saveAsDraft = false){
            //set mail object
            this.setMailPayload();
            let headers = {'Content-Type':'multipart/formdata'}, payload = this.mail;
            //converts the mail object into form data
            payload = this.parseMailObject();
            //saving the message as draft instead of sending
            if(saveAsDraft === true){
                payload.append('saveAsDraft', true);
            }

            axios.post('api/users/me/messages/send', payload, {headers})
            .then(res => {
                if(!res.data.error && res.data.data.id){
                    if(saveAsDraft){
                        alert("Message Saved as Draft!");
                    }
                    else{
                        alert("Message sent successfully!");
                    }

                    //resetting mail object
                    this.resetMail();
                }

                
            })
            .catch(err => {
                Sentry.captureException(err);
            });
        },

        setMailPayload(){
            let mailToArray = this.mailInputArray.to.map(mailContact => mailContact.emailAddresses[0].value);
            let mailCcArray = this.mailInputArray.cc.map(mailContact => mailContact.emailAddresses[0].value);

            this.mail.to = mailToArray.join(',');
            this.mail.cc = mailCcArray.join(',');
        },

        prepareMailObject(){
            let {to, from, subject, replyBody,  messageID} = this.$store.state.replyMailEntity;

            subject = "Re: "+subject;
            this.mail = {
                to, 
                from, 
                subject, 
                replyTo: messageID,
                references: messageID,
                replyBody
            };
        },

        getOtherContacts(){
            axios.get('api/users/me/contacts/other')
            .then(payload => {
                this.otherContacts = payload.data.data;
            })
            .catch(err => {
                Sentry.captureException(err);
            });
        },

        contactSearch(e){
            this.searchedContacts = this.otherContacts;
            this.currentIndex = 0;
            let resultDropdown = document.querySelector(`#${e.target.id} + .dropdown-content`);
            if(this.mailInputs[e.target.id]){
                resultDropdown.style.display = "block";
            }
            else{
                resultDropdown.style.display = "none";
            }
            
            this.searchedContacts = this.searchedContacts.filter(contact => {
                return (contact.emailAddresses[0].value.toLowerCase().startsWith(this.mailInputs[e.target.id].toLowerCase()) || contact.names ? contact.names[0].value.toLowerCase().startsWith(this.mailInputs[e.target.id].toLowerCase()) : false);
            });
        },

        contactSelected(e, mailProp, itemIndex){
            let dropdown = document.querySelector(`#${mailProp} + .dropdown-content`);
            dropdown.style.display = "none";
            //this.mail[mailProp] = email;
            this.mailInputs[mailProp] = this.searchedContacts[itemIndex].emailAddresses[0]?.value;
            this.mailInputArray[mailProp].push(this.searchedContacts[itemIndex]);
            this.mailInputs[mailProp] = '';
            //resetting the focus
            window.$(this.lastFocused).focus();
        },

        hideSearchResult(mailProp){
            let dropdown = document.querySelector(`#${mailProp} + .dropdown-content`);
            dropdown.style.display = "none";
        },

        initQuillEditor(){
            const toolbarOptions = [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', /*'code-block'*/],

                //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction

                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                //[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],

                ['clean']                                         // remove formatting button
            ];

            //Keyboard bindings
            const keyboardBindings = {
                tab: {
                    key: 9,
                    handler: function() {
                      //moving focus to 
                      window.$(".compose-editor + div").find("#dropdownMenuLink .far fa-ellipsis-v").focus();
                      return true;
                    }
                }
            };

            //Creating a quill intsance
            const quill = new Quill('#editor', {
                modules:{
                    toolbar: toolbarOptions,
                    keyboard:{
                        bindings: keyboardBindings
                    }
                },
                theme: 'snow',
                scrollingContainer: '#editor'
            });

            quill.on('editor-change', (eventName) => {
                if (eventName === 'text-change') {
                    this.mail.body = quill.root.innerHTML;
                }
            });
            document.querySelector('.ql-editor').style.display = "none;";
            //Setting tabindex=-1 for quill toolbar
            window.$(".ql-toolbar *").attr('tabindex', '-1');
        },

        attachmentSelected(e){
            //this.mail.attachments = e.target.files;
            let fileList = e.target.files;
            //this.mail.attachments = e.target.files;
            for(let i=0; i<fileList.length; ++i){
                this.mail.attachments.push(fileList[i]);
            }
        },

        attachmentRemove(index){
            this.mail.attachments.splice(index, 1);
        },

        parseMailObject(){
            let formObject = new FormData();
            try{
                for(let key in this.mail){
                    formObject.append(key, this.mail[key]);
                    if(key === "attachments"){
                        for(let i=0; i<this.mail[key].length; ++i){
                            formObject.append(`attachments[${i}]`, this.mail[key][i]);
                        }
                    }
                }
                return formObject;
            }
            catch(err){
                Sentry.captureException(err);
            }
            
        },

        resetMail(){
            this.mail = {
                to: null,
                from: this.$store.state.user.email,
                cc: null,
                subject: null,
                body: null,
                replyBody: null,
                replyTo: null,
                references: null,
                attachments: []
                //date: Date.now()
            }
            //clearing the contents of Quill Editor
            let element = document.getElementsByClassName("ql-editor");
            element[0].innerHTML = "";

            //hiding the search result for to or cc
            if(window.$(`#${this.lastFocused.context.id} + .dropdown-content`).css('display') !== "none"){
                this.hideSearchResult(this.lastFocused.context.id);
            }
        },

        setLastFocus(evt){
            if(evt.target) this.lastFocused = window.$(evt.target);
        },

        pushToActiveFields(contact){
            //targetElement key will contain element id that is equal to mail object keys
            let targetElementKey = '';

            if(this.lastFocused){
               targetElementKey = this.lastFocused.context.id; 
            }
            else{
                targetElementKey = 'to';
            }
            if(this.mailInputArray[targetElementKey].length){
                let etagsArray = this.mailInputArray[targetElementKey].map(contact => contact.etag);
                if(!etagsArray.includes(contact.etag)){
                    this.mailInputArray[targetElementKey].push(contact);
                }
            }
            else{
                this.mailInputArray[targetElementKey].push(contact);
            }
            
            this.resetFocusToLast();
        },

        resetFocusToLast(){
            //resetting focus to last element
            window.$(this.lastFocused).focus();
        },

        onKeyUp(e){
            //e.preventDefault();
            const {escape, enter, arrows, backspace} = this.keyCodes;
            //Close the search Result if escape or enter is pressed
            if(e.keyCode == enter || e.keyCode == escape){
                //while pressing enter if there are no search results
                if(!this.searchedContacts.length){
                    //validate the input value and accept it if okay
                    this.validateMailandAccept(e.target.id);
                }

                this.hideSearchResult(e.target.id);

                //on pressing enter populate the field
                if(e.keyCode == enter) this.populateFieldViaKeyboard(e.target.id);            
            }
            //down arrow key is pressed
            else if(e.keyCode == arrows.down){
                //traverse and select from search results
                this.traverseContactsDown();
            }
            //up arrow key is pressed
            else if(e.keyCode == arrows.up){
                this.traverseContactsUp();
            }
            //backspace key is pressed
            else if(e.keyCode == backspace){
                if(!this.mailInputs[e.target.id]){
                    this.hideSearchResult(e.target.id);
                    /*this.mailInputArray[e.target.id] = this.mailInputArray[e.target.id].splice(this.mailInputArray[e.target.id].length - 1, 1);*/
                }
            }
            else{
                //Search contacts based on char input
                this.contactSearch(e);    
            }
        },

        onKeyDown(e){
            //e.preventDefault();
            const {tab} = this.keyCodes;
            //Close the search Result if tab is pressed
            if(e.keyCode == tab){
                this.hideSearchResult(e.target.id);
            }
        },

        initCurrentIndex(){
            this.currentIndex = -1;
        },

        traverseContactsDown(){
            this.currentIndex = (this.currentIndex + 1) % this.searchedContacts.length;
        },

        traverseContactsUp(){
            this.currentIndex = (this.currentIndex - 1 + this.searchedContacts.length) % this.searchedContacts.length;
        },

        populateFieldViaKeyboard(targetElementKey){
            this.mailInputArray[targetElementKey].push(this.searchedContacts[this.currentIndex]);
            this.mailInputs[targetElementKey] = '';
        },

        removeFromMailInputArray(key, etag){
            let targetIdx = this.mailInputArray[key].findIndex(contact => contact.etag == etag);
            if(targetIdx != -1){
                this.mailInputArray[key].splice(targetIdx, 1); 
            }

            this.resetFocusToLast();
        },

        validateMailandAccept(targetElementKey){
            if(this.isEmail(this.mailInputs[targetElementKey])){
                //push the value to mailInputarray
                this.mailInputArray[targetElementKey].push(this.mailInputs[targetElementKey]);
                this.mailInputs[targetElementKey] = '';
            }
        },

        isEmail(value){
            let regex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g;
            return regex.test(value);
        }
    }
}
</script>

<style>
    /**Styles related to scrollbar */
    ::-webkit-scrollbar {
        width:8px;
    }
    ::-webkit-scrollbar-track {
        -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3); 
        box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius:5px;
    }
    ::-webkit-scrollbar-thumb {
        border-radius:5px;
        -webkit-box-shadow: inset 0 0 6px #333; 
        box-shadow: inset 0 0 6px #333;
    }

    .common__mail__wrapper{
        margin-bottom:revert;
    }

    .reply-to-body{
        border-left: 2px solid black;
        padding: 0 10px;
    }
    .dropdown-content{
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 20%);
        /* padding: 12px 16px; */
        z-index: 1;
        min-width: 300px;
        max-height: 450px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .dropdown-container{
        position: relative;
    }
    .user-profile{
        display:grid;
        grid-template-columns: 20% 80%;
        cursor: pointer;
        padding: 10px 20px;
    }
    .user-profile:hover, .user-profile.selected{
        background: #e4d8d8;
    }
    
    .compose-editor{
        max-height: 340px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .ql-container.ql-snow {
        border: none;
    }
    .user-avatar{
        height: 40px;
        width: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 20px;
    }
    .attachment-container{
        margin: 0 50px;
    }
    .attachment{
        background-color:#d4cdcd73;
        border: 1px solid transparent;
        font-weight: bold;
        padding: 4px 4px 4px 8px;
        min-width: 600px;
    }
    .attachment-remove{
        position: absolute;
        right: 25px;
        cursor: pointer;
    }
    .ql-editor{
        font-size:1.05rem;
        min-height: 250px;
    }
    /*Setting max height of commonly used addresses and making it scrollable */
    .used__addresses{
        max-height: 72vh;
        overflow: auto;
    }
    
    .mail__write__input__field input[name='to'], .mail__write__input__field input[name='cc']{
        width:250px;
    }
</style>