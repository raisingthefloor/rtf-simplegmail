<template>
    <div>
        <div class="common__area ">
            <div class="common__tab__area diff">    
                <nav>
                    <div class="nav__title bg-red d-flex align-items-center justify-content-center">
                        <h5>TRASH</h5>
                        <button type="button" class="empty-btn">Empty Trash</button>
                    </div>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button v-for="(message, index) in messages" :key="index" :class="['nav-link', index == 0 ? 'active' : '']" id="nav-home-tab" data-bs-toggle="tab"
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
                                    <div class="mail__close" @click="unTrashMail(message.id)">
                                        <i class="far fa-times"></i>
                                    </div>
                                </div>
                                <div class="common__mail__body mail--content diff">
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
                                            <li>
                                                <a class="dropdown-item" href="javascript:void(0)" @click="restoreMessage(message.id)">
                                                    Move to folder (INBOX) >
                                                </a>
                                            </li>
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
                                        <button type="button" class="common__btn">Send again with message</button>
                                        <button type="button" class="common__btn">Send to another</button>
                                        <button type="button" class="common__btn">Print</button>

                                        <button @click="unTrashMail(message.id)" type="button" class="common__btn trash--btn">
                                            <b>Delete Permanently</b>
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
import axios from 'axios';
import moment from 'moment';
export default {
    data(){
        return{
            moment:moment,
            messages: []
        }
    },

    mounted(){
        this.getTrashedMessages();
    },

    methods:{
        getTrashedMessages(){
            axios.get('api/users/1/messages/trash')
                .then(payload => {
                    this.messages = payload.data;
                })
                .catch(err => console.log(err));
        },

        unTrashMail(messageId){
            if(confirm("Are you sure you want to delete this permanently?")){
                axios.post(`api/users/me/messages/${messageId}/untrash`)
                .then(payload => {
                    this.messages = this.messages.filter(msg => msg.id != payload.data.id);
                })
                .catch(err => console.log(err));
            }
        },

        restoreMessage(messageId){
            let payload = {
                addLabelIds: ["INBOX"],
                removeLabelIds: ["TRASH"]
            }
            axios.post(`api/users/me/messages/${messageId}/restore`, payload)
                .then(payload => {
                    this.messages = this.messages.filter(msg => msg.id != payload.data.id);
                })
                .catch(e => console.log(e));
        }
    }
}
</script>