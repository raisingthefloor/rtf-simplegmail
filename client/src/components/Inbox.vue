<template>
    <div>
        <div class="common__area ">
            <div class="common__tab__area diff">
                <nav>
                    <div class="nav__title">
                        <h5>email in <b>INBOX</b></h5>
                    </div>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button v-for="(message, index) in messages" :key="index"
                            :class="['nav-link', index == 0 ? 'active' : '']" id="nav-home-tab" data-bs-toggle="tab"
                            :data-bs-target="'#nav-home-'+index" type="button" role="tab" aria-controls="nav-home"
                            :aria-selected="index == 0 ? 'true' : 'false'">
                            <div class="nav__btn__content">
                                <div class="nav__btn__top">
                                    <p>From: {{message.payload.headers.find(header => header.name.toLowerCase() == "from").value}}</p>
                                    <p class="date">{{moment(+message.internalDate).format('DD/MM/YY')}}</p>
                                </div>
                                <!-- <p>RE: Coming home for Easter <span class="new__message">NEW</span></p> -->
                            </div>
                        </button>
                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                    <div v-for="(message, index) in messages" :key="index" :class="['tab-pane', 'fade', index == 0 ? 'active show' : '']" :id="'nav-home-'+index" role="tabpanel"
                        aria-labelledby="nav-home-tab">
                        <div class="common__mail__wrapper">
                            <div class="mail__details__blk position-relative">
                                <div class="mail__details__left">
                                    <p><b> TO:</b> {{message.payload.headers.find(header => header.name.toLowerCase() == "to")?.value ?? ''}}</p>
                                    <p><b>From: </b>
                                        {{message.payload.headers.find(header => header.name.toLowerCase() == "from").value}}
                                    </p>
                                    <p><b> Copy also sent to:</b> </p>
                                    <p><b>Subject:</b> {{message.payload.headers.find(header => header.name.toLowerCase() == "subject").value}}</p>
                                </div>
                                <div class="mail__details__right">
                                    <div class="mail__time">
                                        <p>{{moment(+message.internalDate).format('DD/MM/YY hh:ss a')}}</p>
                                    </div>
                                </div>
                                <div @click="moveToTrash(message.id)" title="Move to Trash" class="mail__close">
                                    <i class="far fa-times"></i>
                                </div>
                            </div>
                            <div class="common__mail__body mail--content">
                                <div v-html="message.decoded_parts ? message.decoded_parts[0] : message.snippet"></div>
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
                                    <button @click="replyClicked(message)" type="button" class="common__btn">
                                        Reply
                                    </button>
                                    <button type="button" class="common__btn">Reply to ALL</button>
                                    <button type="button" class="common__btn">Send to another</button>
                                    <button type="button" class="common__btn">Print</button>
                                    <button type="button" class="common__btn">SAVE</button>
                                    <button @click="moveToTrash(message.id)" type="button" class="common__btn trash--btn">
                                        <span><img src="assets/img/trash-1.png" alt=""></span>
                                        <b>Put in TRASH</b>
                                    </button>
                                </div>
                            </div>
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
export default {
    data(){
        return{
            messages: [],
            moment: moment
        }
    },

    created(){
        this.getInboxMessages();
        this.getThreads();
        this.getThreadMessages();
    },

    methods:{
        getInboxMessages(){
            axios.get('api/users/1/messages/inbox')
                .then(payload => {
                    this.messages = payload.data;
                })
                .catch(err => console.log(err));
        },

        moveToTrash(messageId){
            axios.post(`api/users/me/messages/${messageId}/trash`)
                .then(payload => this.messages = this.messages.filter(msg => msg.id != payload.data.id))
                .catch(err => console.log(err));
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
                .catch(err => console.log(err));
        },

        getThreadMessages(){
            axios.get('api/users/me/thread/17b9c7f7efe196b6/messages')
                .then(payload => console.log(payload))
                .catch(err => console.log(err))
        }
    }
}
</script>