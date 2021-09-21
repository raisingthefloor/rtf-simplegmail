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
            <div class="hide__address__area__book">
                <div class="show__address__book m-width bg-black">
                    <a href=""><span><i class="fal fa-address-book"></i></span>Hide Address Book</a>
                </div>
                <div class="address__book__wrapper">
                    <nav>
                        <h6> MOST USED
                        </h6>
                        <div v-if="filteredContacts.length" class="nav nav-tabs border-0" id="nav-tab" role="tablist">
                            <button v-for="(contact, index) in filteredContacts" :key="index" :class="['nav-link', index == 0 ? 'active' : '']" id="nav-home-tab" data-bs-toggle="tab"
                                :data-bs-target="'#nav-home-'+index" type="button" role="tab" aria-controls="nav-home"
                                aria-selected="true">
                                {{contact.names ? contact.names[0].displayName : contact.emailAddresses[0].value}}
                            </button>
                            
                        </div>
                    </nav>
                    <div class="tab-content" id="nav-tabContent">
                        <div v-for="(contact, index) in filteredContacts" :key="index" :class="['tab-pane fade', index == 0 ? 'show active' : '']" :id="'nav-home-'+index" role="tabpanel"
                            aria-labelledby="nav-home-tab">

                            <div class="user__address__wrapper">
                                <div class="address__profile">
                                    <div class="address__pro-thumb">
                                        <a v-if="contact.photos"> <img :src="contact.photos[0].url" alt="profile"></a>
                                    </div>
                                    <a href="javascript:void(0)">
                                        {{contact.names ? contact.names[0].displayName : contact.emailAddresses[0].value}}
                                    </a>
                                </div>
                                <div class="mail-title">
                                    To send email - Click email address
                                </div>
                                <div class="user--email">
                                    <a href="javascript:void(0)">
                                        {{contact.emailAddresses[0].value}}
                                    </a>
                                </div>
                                <div class="user__address__details">
                                    <h5>Phone </h5>
                                    <p> Cell: {{contact.phoneNumbers ? contact.phoneNumbers[0].value : ''}} </p>
                                    <p> Home: - </p>
                                </div>
                                <div class="user__address__details">
                                    <h5> Mail Address </h5>
                                </div>
                                <div class="user__address__details">
                                    <h5> Notes </h5>
                                </div>


                            </div>


                        </div>
                    </div>
                    
                    <div class="book__pagination">
                        <h6>★</h6>
                        <ul>
                            <li v-for="(letter, index) in alphabetIterator" :key="index">
                                <a href="javascript:void(0)" @click="filterKey=letter.toLowerCase()">{{letter}}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'AddressBook',
    data(){
        return{
            contacts: [],
            filterKey: '',
        }
    },

    mounted(){
        this.getContacts();
    },

    computed:{
        filteredContacts(){
            return this.contacts.filter(contact => {
                return (contact.names[0]?.displayName.toLowerCase().startsWith(this.filterKey) 
                || contact.emailAddresses[0]?.value.toLowerCase().startsWith(this.filterKey));
            });
        },

        alphabetIterator(){
            return {
                from: 65, //A
                to: 91, //Z
                //a special property which makes this object iterable
                [Symbol.iterator](){
                    this.current = this.from;
                    return this;
                },
                //this method generates the value we need
                next(){
                    if(this.current < this.to){
                        return {done: false, value: String.fromCharCode(this.current++)}
                    }
                    else{
                        return {done: true}
                    }
                }
            };
        }
    },

    methods:{
        getContacts(){
            axios.get('api/users/me/contacts')
                .then(response => {
                    if(!response.data.error){
                        this.contacts = response.data.data;
                    }
                })
                .catch(err => console.log(err));
        }
    }
}
</script>