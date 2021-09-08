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
                        <div class="nav nav-tabs border-0" id="nav-tab" role="tablist">
                            <button v-for="(contact, index) in filteredContacts" :key="index" :class="['nav-link', index == 0 ? 'active' : '']" id="nav-home-tab" data-bs-toggle="tab"
                                :data-bs-target="'#nav-home-'+index" type="button" role="tab" aria-controls="nav-home"
                                aria-selected="true">
                                {{contact.names[0].displayName}}
                            </button>
                            
                        </div>
                    </nav>
                    <div class="tab-content" id="nav-tabContent">
                        <div v-for="(contact, index) in filteredContacts" :key="index" :class="['tab-pane fade', index == 0 ? 'show active' : '']" :id="'nav-home-'+index" role="tabpanel"
                            aria-labelledby="nav-home-tab">

                            <div class="user__address__wrapper">
                                <div class="address__profile">
                                    <div class="address__pro-thumb">
                                        <a href=""> <img :src="contact.photos[0].url" alt="profile"></a>
                                    </div>
                                    <a href="javascript:void(0)">{{contact.names[0].displayName}}</a>
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
                return contact.names[0].displayName.toLowerCase().startsWith(this.filterKey);
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
            axios.get('api/users/1/contacts')
                .then(response => {
                    this.contacts = response.data;
                })
                .catch(err => console.log(err));
        }
    }
}
</script>