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
                                        <input name="to" id="to" v-model="mail.to" type="text" @keyup="contactSearch"/>
                                        <div class="dropdown-content">
                                            <div @click="contactSelected($event, 'to', contact.emailAddresses[0].value)" class="user-profile" v-for="contact in searchedContacts" :key="contact.etag">
                                                <div class="user-avatar">
                                                    <a href="javascript:void(0)"> 
                                                        <img :src="contact.photos[0].url" alt="profile">
                                                    </a>
                                                </div>
                                                <div class="user-creds">
                                                    <div class="user-name">{{contact.names[0].displayName}}</div>
                                                    <div class="user-email">{{contact.emailAddresses[0].value}}</div>
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
                                        <input name="cc" id="cc" v-model="mail.cc" type="text" @keyup="contactSearch" />
                                        <div class="dropdown-content">
                                            <div @click="contactSelected($event, 'cc', contact.emailAddresses[0].value)" class="user-profile" v-for="contact in searchedContacts" :key="contact.etag">
                                                <div class="user-avatar">
                                                    <a href="javascript:void(0)"> 
                                                        <img :src="contact.photos[0].url" alt="profile">
                                                    </a>
                                                </div>
                                                <div class="user-creds">
                                                    <div class="user-name">{{contact.names[0].displayName}}</div>
                                                    <div class="user-email">{{contact.emailAddresses[0].value}}</div>
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
                            <div class="mail__close">
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
                                    <span><img src="/assets/img/format.png" alt=""></span>
                                </div>
                                <div class="mail__bottom__action attach--file" title="Add Attachments">
                                    <input type="file" multiple @change="attachmentSelected"/>
                                    <span><img src="/assets/img/attach.png" alt="file_attachments"></span>
                                </div>
                                <div class="mail__bottom__action">
                                    <span><img src="/assets/img/emoji.png" alt=""></span>
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
                        <div class="used__adresses__item">
                            <div v-for="contact in otherContacts" :key="contact.etag" class="address__item">
                                {{contact.names[0].displayName}}
                            </div>
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

export default {
    name: 'MailComposer',

    data(){
        return{
            moment: moment,
            mail:{
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
            },
            otherContacts: [],
            searchedContacts: []
        }
    },

    mounted(){
        //is a replyTo mail
        if(this.$route.query.isReply){
            this.prepareMailObject();
        }
        this.getOtherContacts();
        this.initQuillEditor();
    },

    computed:{
        sendMailDisabled(){
            if(this.mail.to && this.mail.from && this.mail.subject && this.mail.body){
                return false;
            }
            return true;
        },

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
            let headers = {'Content-Type':'multipart/formdata'}, payload = this.mail;
            //converts the mail object into form data
            payload = this.parseMailObject();
            //saving the message as draft instead of sending
            if(saveAsDraft === true){
                payload.append('saveAsDraft', true);
            }

            axios.post('api/users/me/messages/send', payload, {headers})
            .then(payload => console.log(payload.data))
            .catch(err => console.log(err));
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
                this.otherContacts = payload.data;
            })
            .catch(err => console.log(err));
        },

        contactSearch(e){
            this.searchedContacts = this.otherContacts;
            let resultDropdown = document.querySelector(`#${e.target.id} + .dropdown-content`);
            if(this.mail[e.target.id]){
                resultDropdown.style.display = "block";
            }
            else{
                resultDropdown.style.display = "none";
            }
            
            this.searchedContacts = this.searchedContacts.filter(contact => {
                return (contact.names[0].displayName.toLowerCase().includes(this.mail[e.target.id].toLowerCase())
                    || contact.emailAddresses[0].value.toLowerCase().includes(this.mail[e.target.id].toLowerCase()));
            });
        },

        contactSelected(e, mailProp, email){
            let dropdown = document.querySelector(`#${mailProp} + .dropdown-content`);
            dropdown.style.display = "none";
            this.mail[mailProp] = email;
        },

        onBlur(mailProp){
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
            const quill = new Quill('#editor', {
                modules:{
                    toolbar: toolbarOptions
                },
                theme: 'snow',
                scrollingContainer: '#editor'
            });

            quill.on('editor-change', (eventName, ...args) => {
                if (eventName === 'text-change') {
                    this.mail.body = quill.root.innerHTML;
                }
            });
            document.querySelector('.ql-editor').style.display = "none;";
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
    }
}
</script>

<style>
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
    .user-profile:hover{
        background: #e4d8d8;
    }
    
    .compose-editor{
        max-height: 350px;
        overflow-y: scroll;
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
        min-height: 200px;
    }
    /*Setting max height of commonly used addresses and making it scrollable */
    .used__addresses{
        max-height: 72vh;
        overflow: auto;
    }
    .used__addresses::-webkit-scrollbar {
        width:8px;
    }
    .used__addresses::-webkit-scrollbar-track {
        -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3); 
        box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius:5px;
    }
    .used__addresses::-webkit-scrollbar-thumb {
        border-radius:5px;
        -webkit-box-shadow: inset 0 0 6px black; 
        box-shadow: inset 0 0 6px black;
    }
</style>