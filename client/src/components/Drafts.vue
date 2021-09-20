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
        <div class="common__area ">
                <div v-if="messages.length" class="common__tab__area">
                    <nav>
                        <div class="nav__title">
                            <h5>DRAFTs I started <br> but did not  send yet</h5>
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
                                    <!-- <p>RE: Coming home for Easter</p> -->
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
                                        <p><b> TO:</b> {{message.payload.headers.find(header => header.name.toLowerCase() == "to").value ?? ''}}</p>
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
                                    <div class="mail__close">
                                        <i class="far fa-times"></i>
                                    </div>
                                </div>
                                <div class="common__mail__body mail--content diff">
                                    <div v-html="message.decoded_body ? message.decoded_body[0] : message.snippet"></div>
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
                                        <button type="button" class="common__btn">Send again with message</button>
                                        <button type="button" class="common__btn">Send to another</button>
                                        <button type="button" class="common__btn">Print</button>
                                        <button type="button" class="common__btn trash--btn"><span><img
                                                    src="/assets/img/trash-1.png" alt=""></span><b>Put in
                                                TRASH</b></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
                <div v-else class="loader">
                    Loading
                    <!-- <img height="100" width="100" src="/assets/img/spinner.gif" /> -->
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
        this.getDraftMessages();
    },

    methods:{
        getDraftMessages(){
            axios.get('api/users/me/messages/draft')
                .then(payload => {
                    this.messages = payload.data.data;
                })
                .catch(err => console.log(err));
        }
    }
}
</script>