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
                    <router-link :to="lastActiveRoute">
                        <span><i class="fal fa-address-book"></i></span>Hide Address Book
                    </router-link>
                </div>
                <div class="address__book__wrapper">
                    <div class="address__book__groups__column">
                        <h6>groups</h6>
                        <div class="address__group__menu" v-if="contactGroups.length">
                            <button v-for="(group,index) in contactGroups" :key="group.resourceName" :class="['nav-link', index ==  selectedContactGroupIndex ? 'active' : '']" @click="contactGroupSelected(index)"
                            >
                                {{group?.formattedName ?? ''}}
                            </button>
                        </div>
                        <div v-else>
                            <button>No Groups</button>
                        </div>
                        <div class="mt-4" v-if="loading && contactGroups.length <= 1">
                            <p class="text-center">
                                <img src="/assets/img/spinner.gif" height="40" width='40'>
                            </p>
                        </div>
                    </div>
                    <nav style="max-width:275px;min-width:275px;word-break:break-word">
                        <h6 class="text-uppercase"> 
                            {{activeContactGroupName}}
                        </h6>
                        <div v-if="filteredContacts.length" class="nav nav-tabs border-0" id="nav-tab" role="tablist">
                            <button v-for="(contact, index) in filteredContacts" :key="index" :class="['nav-link', index == filteredContactIndex ? 'active' : '']" id="nav-home-tab" data-bs-toggle="tab"
                                :data-bs-target="'#nav-home-'+index" type="button" role="tab" aria-controls="nav-home"
                                aria-selected="true" @click="filteredContactIndex = index">
                                {{contact.names ? contact.names[0]?.displayName : contact.emailAddresses ? contact.emailAddresses[0]?.value : ''}}
                            </button>
                            
                        </div>
                        <div v-if="loading && !filteredContacts.length" class="mt-4">
                            <p class="text-center">
                                <img src="/assets/img/spinner.gif" height="40" width='40'>
                            </p>
                        </div>
                        <div v-if="!filteredContacts.length && !loading">
                            <p>No contacts found</p>
                        </div>
                    </nav>
                    <div v-if="filteredContacts.length" class="tab-content" id="nav-tabContent" style="max-width:385px">
                        <div v-for="(contact, index) in filteredContacts" :key="index" :class="['tab-pane fade', index == filteredContactIndex ? 'show active' : '']" :id="'nav-home-'+index" role="tabpanel"
                            aria-labelledby="nav-home-tab">

                            <div class="user__address__wrapper">
                                <div class="address__profile">
                                    <div class="address__pro-thumb">
                                        <a v-if="contact.photos"> <img :src="contact.photos[0]?.url" alt="profile"></a>
                                    </div>
                                    <a href="javascript:void(0)">
                                        {{contact.names ? contact.names[0]?.displayName : contact.emailAddresses ? contact.emailAddresses[0]?.value : ''}}
                                    </a>
                                </div>
                                <div class="mail-title">
                                    To send email - Click email address
                                </div>
                                <div class="user--email" v-if="contact.emailAddresses">
                                    <router-link :to="`/mail-compose?toAddress=${contact.emailAddresses[0].value}`">
                                        {{contact.emailAddresses ? contact.emailAddresses[0]?.value : ''}}
                                    </router-link>
                                </div>
                                <div class="user__address__details">
                                    <h5>Phone </h5>
                                    <p> Cell: {{contact.phoneNumbers ? contact.phoneNumbers[0]?.value : ''}} </p>
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
                    <div v-else class="text-center mt-4" style="width:100%">
                        <h5>No Contact Information</h5>
                    </div>
                    
                    <div class="book__pagination">
                        <h6 class="cursor-pointer" @click="filterClear" title="Reset Filter">★</h6>
                        <ul>
                            <li v-for="(letter, index) in alphabetIterator" :key="index">
                                <a href="javascript:void(0)" @click="filterApplied(letter)">{{letter}}</a>
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
import * as Sentry from "@sentry/vue";
import {mapGetters} from "vuex";
export default {
    name: 'AddressBook',
    data(){
        return{
            contacts: [],
            othercontacts: [],
            filterKey: '',
            contactGroups: [],
            selectedContactGroupIndex: 0,
            filteredContactIndex: 0,
            loading: false
        }
    },

    mounted(){
        this.getContacts();
    },

    computed:{
        filteredContacts(){
            return this.contacts.filter(contact => {
                return (contact.names ? contact.names[0]?.displayName.toLowerCase().startsWith(this.filterKey) : false 
                || contact.emailAddresses ? contact.emailAddresses[0]?.value.toLowerCase().startsWith(this.filterKey) : false);
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
        },

        activeContactGroupName(){
            return this.contactGroups[this.selectedContactGroupIndex]?.formattedName ?? 'group name';
        },

        ...mapGetters(['lastActiveRoute'])
    },

    methods:{
        getContacts(){
            axios.get('api/users/me/contacts')
                .then(response => {
                    if(!response.data.error){
                        this.contacts = response.data.data;
                        this.contactGroups.push({
                            resourceName: 'contactGroups/other',
                            name: 'most_used',
                            formattedName: 'Most Used',
                            people: this.contacts,
                            memberCount: this.contacts.length
                        });
                        this.getContactGroups();
                    }
                })
                .catch(err => {
                    Sentry.captureException(err);
                });
        },

        getContactGroups(){
            this.loading = true;
            axios.get('/api/users/me/contact/groups')
                .then(res => {
                    if(!res.data.error){
                        this.contactGroups = this.contactGroups.concat(res.data.data.contactGroups);
                    }
                })
                .catch(err => {
                    Sentry.captureException(err);
                })
                .finally(() => this.loading = false);
        },

        contactGroupSelected(index){
            this.contacts = [];
            this.filteredContactIndex = 0;
            this.selectedContactGroupIndex = index;
            
            //check selected group has contacts or not
            if(!this.contactGroups[this.selectedContactGroupIndex].memberCount){
                this.contacts = [];
            }
            /*else if(this.contactGroups[this.selectedContactGroupIndex].name === "most_used"){
                this.contacts = this.otherContacts;
            }*/
            else/* if(this.contactGroups[this.selectedContactGroupIndex].memberCount)*/
            {
                //check if contact group has people array
                if(!this.contactGroups[index].people || !this.contactGroups[index].people.length){
                    //fetch people if it is not already populated for the group
                    this.getGroupMembers(index);
                }
                else{
                    //set contacts = group people if they are already populated
                    this.contacts = this.contactGroups[index].people;
                }
            }
        },

        getGroupMembers(groupIndex){
            this.loading = true;
            let groupResourceName = this.contactGroups[groupIndex].resourceName;
            groupResourceName = groupResourceName.split('/')[1];
            axios.get(`/api/users/contact-group/${groupResourceName}/members`)
                .then(res => {
                    if(!res.data.error){
                        this.contactGroups[groupIndex].people = res.data.data;
                        this.contacts = this.contactGroups[groupIndex].people;
                    }
                })
                .catch(err => Sentry.captureException(err))
                .finally(() => this.loading = false);
        },

        filterApplied(letter){
            this.filteredContactIndex = 0;
            if(this.contacts.length) this.filterKey=letter.toLowerCase();
        },

        filterClear(){
            this.filteredContactIndex = 0;
            this.filterKey = '';
        }
    }
}
</script>

<style>
    @media (min-width: 320px) and (max-width: 1360px){
        .address__book__wrapper {
            max-width: unset;
            margin-right: 70px;
        }
    }

    .text-uppercase{
        text-transform: uppercase;
    }
</style>