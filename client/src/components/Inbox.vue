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
        <div class="common__area d-flex justify-content-between">
            <div class="common__tab__area diff" v-if="messages.length">
                <nav>
                    <div class="nav__title">
                        <h5>email in <b>INBOX</b></h5>
                    </div>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button v-for="(message, index) in messages" :key="index" @click="getMessageDetails(message.id)"
                            :class="['nav-link']" id="nav-home-tab" data-bs-toggle="tab"
                            :data-bs-target="'#nav-home-'+index" type="button" role="tab" aria-controls="nav-home"
                            :aria-selected="index == 0 ? 'true' : 'false'">
                            <div class="nav__btn__content">
                                <div class="nav__btn__top">
                                    <p>From: {{$filters.strip_html(message.payload.headers.find(header => header.name.toLowerCase() == "from").value)}}</p>
                                    <p class="date">{{moment(message.payload.headers.find(header => header.name.toLowerCase() == "date").value).format('DD/MM/YY')}}</p>
                                </div>
                                <div class="nav__btn__top">
                                    <p>RE: {{truncatedSubject(message.payload.headers.find(header => header.name.toLowerCase() == "subject").value)}} </p>
                                    <p><span class="new__message">NEW</span></p>
                                </div>
                                
                            </div>
                        </button>
                        <div v-if="nextPageToken" style="padding: 4px 8px;text-align: right;width: 100%;">
                            <a @click="getInboxMessages" href="javascript:void(0)">More</a>
                        </div>
                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent" v-if="messageDetails && !loading">
                    <div class="tab-pane fade active show" id="nav-home-1" role="tabpanel"
                        aria-labelledby="nav-home-tab">
                        <div class="common__mail__wrapper">
                            <div class="mail__details__blk position-relative">
                                <div class="mail__details__left">
                                    <p><b> TO:</b> {{messageDetails.payload.headers.find(header => header.name.toLowerCase() == "to")?.value ?? ''}}</p>
                                    <p><b>From: </b>
                                        {{messageDetails.payload.headers.find(header => header.name.toLowerCase() == "from").value}}
                                    </p>
                                    <p><b> Copy also sent to:</b> </p>
                                    <p><b>Subject:</b> {{messageDetails.payload.headers.find(header => header.name.toLowerCase() == "subject").value}}</p>
                                </div>
                                <div class="mail__details__right">
                                    <div class="mail__time">
                                        <p>{{moment(+messageDetails.internalDate).format('DD/MM/YY hh:ss a')}}</p>
                                    </div>
                                </div>
                                <div @click="closeMail" title="Close Mail" class="mail__close">
                                    <i class="far fa-times"></i>
                                </div>
                            </div>
                            <div class="common__mail__body mail--content">
                                <div class="msg-body" v-html="messageDetails.decoded_parts ? messageDetails.decoded_parts[0] : messageDetails.snippet"></div>
                            </div>
                            <div class="common__mail__bottom d-flex">
                                <div class="dropdown mail__more__option ">
                                    <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="far fa-ellipsis-v"></i>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-start"
                                        aria-labelledby="dropdownMenuLink">
                                        <li><a class="dropdown-item" href="#"> Reply </a></li>
                                        <li><a class="dropdown-item" href="#"> Reply to all
                                            </a></li>
                                        <li><a class="dropdown-item" href="#">Forward</a></li>
                                        <li><a class="dropdown-item" href="#">Show Original
                                            </a></li>
                                        <li><a class="dropdown-item" href="#">Translate Message
                                            </a></li>
                                        <li><a class="dropdown-item" href="#">Download Message
                                            </a></li>
                                        <li><a class="dropdown-item" href="#">Move to folder (Add label) >
                                            </a></li>
                                        <li><a class="dropdown-item" href="#">---------
                                            </a></li>
                                        <li><a class="dropdown-item" href="#">Mark as Unread (/Mark as Read)
                                            </a></li>
                                        <li><a class="dropdown-item" href="#">Mark as Important (/not important)
                                            </a></li>
                                        <li><a class="dropdown-item" href="#">Add Star (remove Star)
                                            </a></li>
                                        <li><a class="dropdown-item" href="#">---------
                                            </a></li>
                                        <li><a class="dropdown-item" href="#">Create Event
                                            </a></li>
                                        <li><a class="dropdown-item" href="#">Filter messages like these
                                        </a></li>
                                        <li><a class="dropdown-item" href="#">Mute </a></li>
                                        <li><a class="dropdown-item" href="#">Forward All
                                        </a></li>
                                    </ul>
                                </div> 
                                <div class="mail__bottom__btns">
                                    <button @click="replyClicked(messageDetails)" type="button" class="common__btn">
                                        Reply
                                    </button>
                                    <button type="button" class="common__btn">Reply to ALL</button>
                                    <button type="button" class="common__btn">Send to another</button>
                                    <button type="button" class="common__btn">Print</button>
                                    <button type="button" class="common__btn">SAVE</button>
                                    <button @click="moveToTrash(messageDetails.id)" type="button" class="common__btn trash--btn">
                                        <span><img src="/assets/img/trash-1.png" alt=""></span>
                                        <b>Put in TRASH</b>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--Loader while message details are being fetched -->
                <div v-if="loading" class="tab-content" id="nav-tabContent" style="width:700px">
                    <div class="tab-pane fade active show" id="nav-home-1" role="tabpanel"
                        aria-labelledby="nav-home-tab">
                        <div class="loader"></div>
                    </div>
                </div>
            </div> 
            <div v-if="loading && !messages.length" class="loader">
                <!-- <img height="100" width="100" src="/assets/img/spinner.gif" /> -->
            </div>
            <div v-if="messages.length && !messageDetails && !loading" class="show__address__book m-width">
                <router-link to="/address-book">
                    <span><i class="fal fa-address-book"></i></span>Show Full Address Book
                </router-link>
            </div>
            
        </div>
    </div>
</template>

<script>
import * as Sentry from "@sentry/vue";
import moment from 'moment';
import axios from 'axios';
/*import { mapState } from 'vuex';
import {Buffer} from 'buffer/';*/

export default {
    data(){
        return{
            messages: [],
            messageDetails: null,
            nextPageToken: null,
            moment: moment,
            loading: false
        }
    },

    created(){
        this.getInboxMessages();
        //this.getThreads();
        //this.getThreadMessages();
    },

    /*mounted(){
        if(this.googleCreds.isSignedIn){
            this.getInboxMessages();
        }
    },

    computed: mapState(['googleCreds']),

    watch:{
        googleCreds: {
            handler(newVal, oldVal){
                if(newVal.isSignedIn){
                    this.getInboxMessages();
                }
            },
            deep: true
        }
    },*/ 
    methods:{
        getInboxMessages(){
            this.messages = [];
            this.loading = true;
            axios.get(`api/users/me/messages/inbox?nextPage=${this.nextPageToken}`)
                .then(payload => {
                    if(!payload.data.error){
                        this.messages = payload.data.data;
                        this.nextPageToken = payload.data.nextPageToken;
                    }
                    this.loading = false;
                })
                .catch(err => {
                    Sentry.captureException(err);
                });
        },

        moveToTrash(messageId){
            if(confirm("Are you sure you want to send this mail to Trash?")){
                this.loading = true;
                axios.post(`api/users/me/messages/${messageId}/trash`)
                .then(payload => {
                    this.messages = this.messages.filter(msg => msg.id != payload.data.data.id);
                    this.loading = false;
                    this.closeMail();
                })
                .catch(err => {
                    Sentry.captureException(err);
                });
            }
        },

        replyClicked(message){
            let to = message.payload.headers.find(header => header.name.toLowerCase() == "from").value, //interchanging receiver and sender
                from = message.payload.headers.find(header => header.name.toLowerCase() == "to").value, 
                subject = message.payload.headers.find(header => header.name.toLowerCase() == "subject").value,
                messageID = message.payload.headers.find(header => header.name.toLowerCase() == "message-id").value,
                replyBody = message.decoded_parts ? message.decoded_parts[0] : message.snippet;

            this.$store.commit('updateReplyMailEntity', {to, from, subject, messageID, replyBody})
            this.$router.push(`/mail-compose?isReply=true`);
        },

        getThreads(){
            axios.get('api/users/me/threads')
                .then(response => console.log(response))
                .catch(err => {
                    Sentry.captureException(err);
                });
        },

        getThreadMessages(){
            axios.get('api/users/me/thread/17b9c7f7efe196b6/messages')
                .then(payload => console.log(payload))
                .catch(err => {
                    Sentry.captureException(err);
                })
        },

        truncatedSubject(subject){
            if(typeof subject !== "string") return '';

            const maxLength = 20;
            //truncate subject if it exceeds the given maxLength
            if(subject.length > maxLength){
                return subject.slice(0, maxLength) + " ...";
            }
            return subject;
        },

        getMessageDetails(messageId){
            this.loading = true;
            axios.get(`api/users/me/message/${messageId}`)
                .then(payload => {
                    if(!payload.data.error){
                        this.messageDetails = payload.data.data;
                        if(this.messageDetails.decoded_attachments?.length){
                            let parsedAttachment = this.parseAttachments(this.messageDetails.decoded_attachments);
                            if(this.messageDetails.decoded_parts){
                                this.messageDetails.decoded_parts[0] += parsedAttachment;
                            }
                            else{
                                this.messageDetails.snippet += parsedAttachment;
                            }
                        }
                    }
                    this.loading = false;
                })
                .catch(err => {
                    Sentry.captureException(err);
                })
        },

        closeMail(){
            this.messageDetails = null;
            let activeElement = document.querySelector('.nav-link.active');
            activeElement.classList.remove('active');
        },

        parseAttachments(decodedAttachments){
            let attachmentHTML = "";
            for(let attachment of decodedAttachments){
                if (attachment.attachment_data.data.length > 0)
                {
                    let dataBase64Rep = attachment.attachment_data.data.replace(/-/g, '+').replace(/_/g, '/');
                    let urlBlob = this.b64toBlob(dataBase64Rep, attachment.mimeType, attachment.attachment_data.size);

                    attachmentHTML += `<a href="`+urlBlob+`" download="`+attachment.filename+`"> <div style="margin-top: 0.5rem; padding: 0.3rem; border: 1px solid #ccc; cursor: pointer;">
                    `+attachment.filename+`
                    </div></a>`
                    //URL.revokeObjectURL(urlBlob)
                }
            }
            
            return attachmentHTML;
        },

        b64toBlob (b64Data, contentType, sliceSize) {
            contentType = contentType || ''
            sliceSize = sliceSize || 512

            var byteCharacters = atob(b64Data)
            var byteArrays = []

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize)

                var byteNumbers = new Array(slice.length)
                for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i)
                }

                var byteArray = new Uint8Array(byteNumbers)

                byteArrays.push(byteArray)

            }
            var blob = new Blob(byteArrays, {type: contentType})
            let urlBlob = URL.createObjectURL(blob)
            return urlBlob
        }
        /*getSingleProcessedMessage(msgId){
            gapi.client.gmail.users.messages.get({
                userId: 'me',
                id: msgId
            })
            .then(res => {
                let result = res.result;
                this.messages.push(this.processMessage(result));
            })
            .catch(e => console.log(e));
        },

        processMessage(mail){
            //Mail Top Level Headers
            //const headers = mail_data.payload.headers;

            //Process multipart/mixed mail
            if(mail.payload.mimeType == "multipart/mixed"){
                mail = this.processMultipartMixed(mail);
            }
            //Process multipart/alternative mail
            else if(mail.payload.mimeType == "multipart/alternative"){
                mail = this.processMultipartAlternative(mail);
            }
            //Processs text/html mail
            else if(mail.payload.mimeType == "text/html"){
                mail = this.processTextHtml(mail);
            }
            else if(mail.payload.mimeType == "multipart/related"){
                mail = this.processMultipartRelated(mail);
            }
    
            return mail;
        },

        processMultipartMixed(mail){
            //Mail Top level headers describing the following body
            const headers = mail.payload.headers;

            //let messageId = headers.find(obj => obj.name == "Message-ID")
            let mail_alternative = mail.payload.parts.find(x => x.mimeType == "multipart/alternative")
            if(mail_alternative)
            {
                let html_part = mail_alternative.parts.find(y => y.mimeType == "text/html")
                let buff = new Buffer.from(html_part.body.data, 'base64')
                let text = buff.toString('utf8')
                let attachments = mail.payload.parts.filter(obj => obj.mimeType != "multipart/alternative")
                mail.decoded_attachments = attachments
                mail.decoded_body = []
                mail.decoded_body[0] = text
            }
            let mail_related = mail.payload.parts.find(x => x.mimeType == "multipart/related")
            if (mail_related)
            {
                let textHtml = mail.payload.parts.find(obj => obj.mimeType == "text/html")
                let buff = new Buffer.from(textHtml.body.data, 'base64')
                let text = buff.toString('utf8');
                mail.decoded_body = []
                mail.decoded_body[0] = text
            }

            return mail;
        },

        processMultipartAlternative(mail){
            if(mail.payload.body.data)
            {
                let buff = new Buffer.from(mail.payload.body.data, 'base64')
                let text = buff.toString('utf8');
                mail.decoded_body = []
                mail.decoded_body[0] = text
                
            }
            if(mail.payload.parts)
            {
                let obj = mail.payload.parts.find(x => x.mimeType === 'text/html')
                if(obj){
                    let buff = new Buffer.from(obj.body.data, 'base64');
                    let text = buff.toString('utf8');
                    mail.decoded_parts = []
                    mail.decoded_parts[0] = text
                }
            }
            return mail;
        },
        
        processMultipartRelated(mail){
            //check if alternative
            let multipartAlternative = mail.payload.parts.find(obj => obj.mimeType == "multipart/alternative")
            if(multipartAlternative)
            {
                if(multipartAlternative.body.data)
                {
                    let buff = new Buffer.from(multipartAlternative.body.data, 'base64')
                    let text = buff.toString('utf8');
                    mail.decoded_body = []
                    mail.decoded_body[0] = text
                }
                if(multipartAlternative.parts)
                {
                    let obj = multipartAlternative.parts.find(x => x.mimeType === 'text/html')
                    let buff = new Buffer.from(obj.body.data, 'base64');
                    let text = buff.toString('utf8');
                    mail.decoded_parts = []
                    mail.decoded_parts[0] = text
                }
            }
            //check if text/html
            let textHtml = mail.payload.parts.find(obj => obj.mimeType == "text/html")
            if(textHtml)
            {
                let buff = new Buffer.from(textHtml.body.data, 'base64')
                let text = buff.toString('utf8');
                mail.decoded_body = []
                mail.decoded_body[0] = text
            }
            return mail;

        },

        processTextHtml(mail){
            let buff = new Buffer.from(mail.payload.body.data, 'base64')
            let text = buff.toString('utf8');
            mail.decoded_body = []
            mail.decoded_body[0] = text
            return mail;
        }*/
    }
}
</script>

<style>
.common__tab__area.diff nav{
    width:270px;
    flex: 0 0 270px;
}
.nav.nav-tabs button + a{
    margin-right: 0;
}
/*.msg-body{
    max-height:250px;
    overflow-y:auto;
}
.common__mail__body{
    max-height:300px;
}*/
</style>