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
    <!--New Threaded UI-->
    <div :class="['common__area', 'justify-content-between', !messageDetails ? 'd-flex' : '']">
        <div class="common__tab__area diff" v-if="threads.length">
            <nav>
                <div class="nav__title">
                    <h5>email in <b>INBOX</b></h5>
                </div>

                <div class="nav nav-tabs" id="nav-tab" role="tablist">

                    <button v-for="(thread, index) in threads" :key="index" @click="getMessageDetails(thread.messages[thread.messages.length - 1].id);setCurrentIndex(index)" :class="['nav-link']" :id="`nav-home-tab-${index}`" data-bs-toggle="tab" :data-bs-target="'#nav-home-'+index" type="button" role="tab" aria-controls="nav-home" :aria-selected="index == 0 ? 'true' : 'false'" :ref="`inbox_msg_${index}`" @keydown="onKeyDown"
                    >
                        <div class="nav__btn__content" v-if="thread.messages.length">
                            <div class="nav__btn__top">
                                <p>From: {{$filters.strip_html(thread.messages[thread.messages.length - 1].payload.headers.find(header => header.name.toLowerCase() == "from")?.value)}}

                                    <b v-if="thread.messages.length > 1" :title="`${thread.messages.length} messages in this conversation`"
                                    >
                                        ({{thread.messages.length}})
                                    </b>
                                </p>  
                                <p class="date">{{moment(thread.messages[thread.messages.length - 1].payload.headers.find(header => header.name.toLowerCase() == "date")?.value)?.format('DD/MM/YY')}}</p>
                            </div>
                            <div class="nav__btn__top">
                                <p>RE: {{truncatedSubject(thread.messages[thread.messages.length - 1].payload.headers.find(header => header.name.toLowerCase() == "subject")?.value)}} </p>
                                <p v-if="thread.messages[thread.messages.length - 1].labelIds.includes('UNREAD')">
                                    <span class="new__message">NEW</span>
                                </p>
                            </div>
                                
                        </div>
                    </button>
                    <div v-if="nextPageToken" style="padding: 4px 8px;text-align: right;width: 100%;">
                        <a @click="getThreads" href="javascript:void(0)">More</a>
                    </div>
                </div>
            </nav>


            <div class="tab-content" id="nav-tabContent" v-if="messageDetails && !loading">
                <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    <div class="common__mail__wrapper">
                        <div class="mail__details__blk position-relative">
                            <div class="mail__details__left">
                                <p>
                                    <b> TO:</b> {{messageDetails.payload.headers.find(header => header.name.toLowerCase() == "to")?.value ?? ''}}
                                </p>
                                <p>
                                    <b>From: </b>
                                    {{messageDetails.payload.headers.find(header => header.name.toLowerCase() == "from")?.value}}
                                </p>
                                <p><b> Copy also sent to:</b> </p>
                                <p>
                                    <b>Subject:</b> 
                                    {{messageDetails.payload.headers.find(header => header.name.toLowerCase() == "subject")?.value}}
                                </p>
                            </div>
                            <div class="mail__details__right">
                                <div class="mail__time">
                                    <p>{{moment(+messageDetails?.internalDate).format('DD/MM/YY HH:ss a')}}</p>
                                </div>
                            </div>
                            <div @click="closeMail" title="Close Mail" class="mail__close">
                                <i class="far fa-times"></i>
                            </div>
                        </div>
                        <div class="thread__area" v-if="hasMoreThanOneMessages">
                            <p>(There are {{remainingMsgCount}} other emails in this conversation)</p>
                            <!-- <a href="javascript:void(0)" @click>Show related emails</a> -->
                            <router-link :to="`/inbox/thread/${messageDetails.threadId}`">Show related emails</router-link>

                        </div>

                        <div class="common__mail__body mail--content diff">
                           <div v-html="messageDetails.decoded_parts ? messageDetails.decoded_parts[0] : messageDetails.snippet"></div>         
                        </div>

                        <div class="common__mail__bottom d-flex">
                                    
                            <div class="mail__bottom__btns">
                                <button type="button" class="common__btn">Send again with message</button>
                                <button type="button" class="common__btn">Send to another</button>
                                <button type="button" class="common__btn">Print</button>
                                <button type="button" class="common__btn trash--btn">
                                    <span>
                                        <img src="assets/img/trash-1.png" alt="">
                                    </span>
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

        <div v-if="loading && !threads.length" class="loader"></div>

        <div v-if="threads.length && !loading && !messageDetails" class="show__address__book m-width">
            <router-link to="/address-book">
                <span><i class="fal fa-address-book"></i></span>Show Full Address Book
            </router-link>
        </div>
    </div>

</template>

<script>
import * as Sentry from "@sentry/vue";
import moment from 'moment';
import axios from 'axios';
import { mapState } from 'vuex';
/*import {Buffer} from 'buffer/';*/

export default {
    data(){
        return{
            //messages: [],
            messageDetails: null,
            threads: [],
            nextPageToken: null,
            moment: moment,
            loading: false,
            currentIndex: 0
        }
    },

    created(){
        //this.getInboxMessages();
        this.getThreads();
        //this.getThreadMessages();
    },

    computed:{
        ...mapState(['keyCodes']),

        hasMoreThanOneMessages(){
            let thread = this.threads.find(thread => thread.id === this.messageDetails?.threadId);
            return thread?.messages?.length > 1;
        },

        remainingMsgCount(){
            let thread = this.threads.find(thread => thread.id === this.messageDetails?.threadId);
            return thread?.messages?.length - 1; 
        }
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
        /*getInboxMessages(){
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
        },*/

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
            this.threads = [];
            this.loading = true;
            axios.get('api/users/me/inbox/threads?nextPage='+this.nextPageToken)
                .then(response => {
                    //response has no error
                    if(!response.data.error){
                        const {threads, nextPageToken} = response.data.data;
                        this.threads = threads;
                        this.nextPageToken = nextPageToken;
                    }
                    this.loading = false;
                })
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
        },

        setCurrentIndex(index){
            this.currentIndex = index;
        },

        onKeyDown(e){
            const {arrows} = this.keyCodes;
            if(e.keyCode == arrows.down){
                this.traverseMsgListDown();
            }

            else if(e.keyCode == arrows.up){
                this.traverseMsgListUp();
            }

            else if(e.keyCode == arrows.left){
                this.relayFocusToSidebar();
            }
        },

        traverseMsgListDown(){
            this.currentIndex = (this.currentIndex + 1 ) % this.messages.length;
            this.focusElement();
        },

        traverseMsgListUp(){
            this.currentIndex = (this.currentIndex -1 + this.messages.length) % this.messages.length;
            this.focusElement();
        },

        focusElement(){
            let el = this.$refs[`inbox_msg_${this.currentIndex}`];
            el.focus();
        },

        relayFocusToSidebar(){
            //set the focus to the first label
            let el = window.$("#lbl_id_0").find('a');
            el.focus();
        },

        /*setCurrentThreadMsgs(){
            let messages = this.threads.find(thread => thread.id === this.messageDetails.threadId)?.messages ?? [];
            this.$store.commit('UPDATE_CURRENT_THREAD_MESSAGES', messages);
        }
        getSingleProcessedMessage(msgId){
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
</style>