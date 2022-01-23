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
        <!-- Header area start -->
        <div class="header__area">
        <div class="container">
            <div class="header__left">
                <div class="menu__open" @click="toggleSideMenu" title="Open Menu">
                    <i class="far fa-bars"></i>
                </div>
                <div class="logo__main cursor-pointer">
                    <a href="javascript:void(0)">
                        <img src="/assets/img/logo-main.png" alt="EasyMail">
                    </a>
                    <span class="logo__title">EasyMail</span>
                </div>
                <div :class="['header__search dropdown-container', searchKey.length ? 'no-border-bottom-radius' : '']">
                    <button type="button" class="search__button hd-btn">
                        <i class="far fa-search"></i>
                    </button>
                    <input type="text" v-model="searchKey" placeholder="Search mail">
                    <button v-show="searchKey.length" type="button" class="filter__btn hd-btn" @click="clearSearchKey"
                    >
                        <i class="far fa-times"></i>
                    </button>
                    <button type="button" class="filter__btn hd-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24"
                            height="24" viewBox="0 0 24 24">
                            <path
                                d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z">
                            </path>
                        </svg>
                    </button>

                    <!--Dropdown Search Result-->
                    <div v-show="searchKey.length && searchResults.length" class="dropdown-content">
                        <div v-for="result in searchResults" :key="result.id" class="search-result-item" role="button">

                            <div class="search-result-icon">
                                <i class="far fa-search"></i>
                            </div>

                            <div class="search-result-data">
                                <table cellpadding="0" cellspacing="0" class="search-result-data">
                                    <tbody>
                                        <tr>
                                            <!--Subject or Contact Name-->
                                            <td>
                                                {{getResultSubject(result)}}
                                            </td>
                                        </tr>

                                        <tr>
                                            <!--Subject or Contact Name-->
                                            <td>
                                                {{getResultContacts(result)}}        
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="search-result-date">
                                <table cellpadding="0" cellspacing="0" class="search-result-data">
                                    <tbody>
                                        <tr>
                                            <!--Subject or Contact Name-->
                                            <td rowspan="2" style="word-break: break-word">
                                                {{getResultDate(result)}}    
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!--Advanced Search Filter-->
                    <div class="advanced-search dropdown-content p-3">
                        <div class="row">
                            <div class="col-xs-5 col-md-3 pt-2">
                                <label for="from" class="label-txt fs-6">From</label>
                            </div>
                            <div class="col-xs-7 col-md-9">
                                <input name="from" id="from" />
                            </div>
                        </div>

                        <div class="row pt-2">
                            <div class="col-xs-5 col-md-3 pt-2">
                                <label for="to" class="label-txt fs-6">To</label>
                            </div>
                            <div class="col-xs-7 col-md-9">
                                <input name="to" id="to" />
                            </div>
                        </div>


                        <div class="row pt-2">
                            <div class="col-xs-5 col-md-3 pt-2">
                                <label for="subject" class="label-txt fs-6">Subject</label>
                            </div>
                            <div class="col-xs-7 col-md-9">
                                <input name="subject" id="subject" />
                            </div>
                        </div>


                        <div class="row pt-2">
                            <div class="col-xs-5 col-md-3 pt-2">
                                <label for="has-the-words" class="label-txt fs-6">Has the words</label>
                            </div>
                            <div class="col-xs-7 col-md-9">
                                <input name="has_the_words" id="has-the-words" />
                            </div>
                        </div>

                        <div class="row pt-2">
                            <div class="col-xs-5 col-md-3 pt-2">
                                <label for="does-not-have" class="label-txt fs-6">Doesn't have</label>
                            </div>
                            <div class="col-xs-7 col-md-9">
                                <input name="does_not_have" id="does-not-have" />
                            </div>
                        </div>

                        <div class="row pt-2">
                            <div class="col-xs-5 col-md-3 pt-2">
                                <label for="size" class="label-txt fs-6">Size</label>
                            </div>
                            <div class="col-xs-5 col-md-5">
                                <select>
                                    <option selected></option>
                                    <option value="greater_than">greater than</option>
                                    <option value="less_than">less than</option>
                                </select>
                            </div>
                            <div class="col-xs-1 col-md-2">
                                <input name="size" id="size" />
                            </div>
                            <div class="col-xs-1 col-md-2">
                                <select>
                                    <option selected></option>
                                    <option value="mb">MB</option>
                                    <option value="kb">KB</option>
                                    <option value="bytes">Bytes</option>
                                </select>
                            </div>
                        </div>

                        <div class="row pt-2">
                            <div class="col-xs-4 col-md-3 pt-2">
                                <label for="date" class="label-txt fs-6">Date within</label>
                            </div>
                            <div class="col-xs-5 col-md-5">
                                <select>
                                    <option selected></option>
                                    <option>1 day</option>
                                    <option>3 days</option>
                                    <option>1 week</option>
                                    <option>2 weeks</option>
                                    <option>1 month</option>
                                    <option>2 months</option>
                                    <option>6 months</option>
                                    <option>1 year</option>
                                </select>
                            </div>
                            <div class="col-xs-3 col-md-4">
                                <input type="date" name="date" id="date" />
                            </div>
                        </div>

                        <div class="row pt-2">
                            <div class="col-xs-5 col-md-3 pt-2">
                                <label for="search-in" class="label-txt fs-6">Search</label>
                            </div>
                            <div class="col-xs-7 col-md-9">
                                <select name="search_in" id="search-in" class="px-1">
                                    <option></option>
                                    <option>All mail</option>
                                    <option>Inbox</option>
                                    <option>Sent</option>
                                    <option>Drafts</option>
                                    <option>Spam</option>
                                    <option>Trash</option>

                                    <option value="">________________________________________________________________________</option>

                                    <option>Mail &nbsp; Spam &nbsp; Trash </option>

                                    <option value="">________________________________________________________________________</option>

                                    <option>Read Mail</option>
                                    <option>Unread Mail</option>

                                    <option value="">________________________________________________________________________</option>

                                    <option>User defined labels</option>
                                </select>
                            </div>
                        </div>

                        <div class="row pt-3">
                            <div class="col-md-1 px-0">
                                <input type="checkbox" id="has-attachment"/>
                            </div>
                            <div class="col-md-11 px-0">
                                <label for="has-attachment" class="label-txt">Has attachment</label>
                            </div>
                        </div>

                        <div class="row pt-2">
                            <div class="text-end col-md-10">
                                <button type="button" class="btn btn-light">Clear Filter</button>
                            </div>
                            <div class="col-md-1">
                                <button type="button" class="btn btn-primary">Search</button>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
            <div class="header__right">
                <div class="head__right__btns">
                    <div class="head__right__btn">
                        <div class="dropdown">
                            <a class="btn hd-btn dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <svg class="t7" xmlns="http://www.w3.org/2000/svg" width="29px" height="29px"
                                    viewBox="0 0 24 24" fill="#000000" focusable="false">
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path
                                        d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z">
                                    </path>
                                </svg>
                            </a>

                            <!-- <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink">
                                <li><a class="dropdown-item" href="#">Action</a></li>
                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                            </ul> -->
                        </div>
                    </div>
                    <div class="head__right__btn">
                        <a class="btn hd-btn dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <svg class="Xy" xmlns="http://www.w3.org/2000/svg" width="29" height="29"
                                viewBox="0 0 24 24">
                                <path
                                    d="M13.85 22.25h-3.7c-.74 0-1.36-.54-1.45-1.27l-.27-1.89c-.27-.14-.53-.29-.79-.46l-1.8.72c-.7.26-1.47-.03-1.81-.65L2.2 15.53c-.35-.66-.2-1.44.36-1.88l1.53-1.19c-.01-.15-.02-.3-.02-.46 0-.15.01-.31.02-.46l-1.52-1.19c-.59-.45-.74-1.26-.37-1.88l1.85-3.19c.34-.62 1.11-.9 1.79-.63l1.81.73c.26-.17.52-.32.78-.46l.27-1.91c.09-.7.71-1.25 1.44-1.25h3.7c.74 0 1.36.54 1.45 1.27l.27 1.89c.27.14.53.29.79.46l1.8-.72c.71-.26 1.48.03 1.82.65l1.84 3.18c.36.66.2 1.44-.36 1.88l-1.52 1.19c.01.15.02.3.02.46s-.01.31-.02.46l1.52 1.19c.56.45.72 1.23.37 1.86l-1.86 3.22c-.34.62-1.11.9-1.8.63l-1.8-.72c-.26.17-.52.32-.78.46l-.27 1.91c-.1.68-.72 1.22-1.46 1.22zm-3.23-2h2.76l.37-2.55.53-.22c.44-.18.88-.44 1.34-.78l.45-.34 2.38.96 1.38-2.4-2.03-1.58.07-.56c.03-.26.06-.51.06-.78s-.03-.53-.06-.78l-.07-.56 2.03-1.58-1.39-2.4-2.39.96-.45-.35c-.42-.32-.87-.58-1.33-.77l-.52-.22-.37-2.55h-2.76l-.37 2.55-.53.21c-.44.19-.88.44-1.34.79l-.45.33-2.38-.95-1.39 2.39 2.03 1.58-.07.56a7 7 0 0 0-.06.79c0 .26.02.53.06.78l.07.56-2.03 1.58 1.38 2.4 2.39-.96.45.35c.43.33.86.58 1.33.77l.53.22.38 2.55z">
                                </path>
                                <circle cx="12" cy="12" r="3.5"></circle>
                            </svg>
                        </a>
                    </div>
                    <div class="head__right__btn">
                        <div class="dropdown">
                            <a class="btn hd-btn grid dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <svg class="gb_Ve" focusable="false" viewBox="0 0 24 24">
                                    <path
                                        d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c0,1.1 0.9,2 2,2s2,-0.9 2,-2 -0.9,-2 -2,-2 -2,0.9 -2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z">
                                    </path>
                                </svg>
                            </a>

                            <!-- <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink">
                                <li><a class="dropdown-item" href="#">Action</a></li>
                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                            </ul> -->
                        </div>
                    </div>
                </div>
                <div class="header__profile__wrap">
                    <div class="dropdown">
                        <a class="dropdown-toggle" style="text-decoration: none;" href="#" role="button"
                            id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                            <div class="header__profile">
                                <h6>Google</h6>
                                <div class="profile-thumb">
                                    <img v-if="profilePictureUrl" :src="profilePictureUrl" 
                                        :alt="appActiveUser.email" :title="appActiveUser.name" />
                                    <img v-else src="/assets/img/profile.jpg" :alt="appActiveUser.email" :title="appActiveUser.name"/>

                                </div>
                            </div>
                        </a>

                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <!-- <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li> -->
                            <li @click="logoutHandler">
                                <a class="dropdown-item" href="#">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="offcanvas-overlay" @click="toggleSideMenu">

    </div>
    <!-- Header area end -->
    </div>
</template>

<script>
import {mapState} from "vuex";
import moment from 'moment';
    export default{
        data(){
            return{
                moment
            };
        },

        props:{
            profilePicUrl:{
                type: String,
                required: true
            }
        },

        computed:{
            ...mapState(['appActiveUser', 'searchResults']),

            profilePictureUrl(){
                let url = "";
                if(!this.profilePicUrl){
                    url = this.appActiveUser.profilePicUrl;
                }
                else{
                    url = this.profilePicUrl;
                }
                return url;
            },

            searchKey: {
                get(){
                    return this.$store.state.searchKey;
                },
                set(val){
                    this.$store.commit('UPDATE_SEARCH_KEY', val);
                }
            }
        },

        methods: {
            logoutHandler(){
                this.$store.commit('LOGOUT_USER');
                this.$router.push('/login');
                //this.googleLogoutHandler();
            },

            toggleSideMenu(){
                window.$('.menu__bar , .offcanvas-overlay').toggleClass('show');
            },

            clearSearchKey(){
                this.searchKey = '';
            },

            getResultSubject(result){
                if(result.messages.length){
                    //getting the latest message in the thread
                    let message = result.messages[result.messages.length - 1];
                    let subject = message.payload?.headers?.find(header => header.name.toLowerCase() === "subject")?.value;
                    return this.$filters.truncatedSubject(subject, 80);
                }
                return '';
            },

            getResultContacts(result){
                if(result.messages.length){
                    //getting from and to contact of latest message
                    let message = result.messages[result.messages.length - 1];
                    let from = message.payload?.headers?.find(header => header.name.toLowerCase() === "from")?.value,
                        to = message.payload?.headers?.find(header => header.name.toLowerCase() === "to")?.value;
                    from = this.$filters.strip_html(from);
                    from = this.appActiveUser.email === from ? 'me' : from;

                    to = this.$filters.strip_html(to);
                    to = this.appActiveUser.email === to ? 'me' : to;
                    return `${from}, ${to}`;
                }
                return '';
            },

            getResultDate(result){
                if(result.messages.length){
                    //getting from and to contact of latest message
                    let message = result.messages[result.messages.length - 1];
                    let date = message.payload?.headers?.find(header => header.name.toLowerCase() === "date")?.value;
                    return this.moment(date).format('DD/MM/YY');
                }
                return '';
            }
        }
    }
</script>

<style scoped>
    .logo__main img {
        border-radius: 50px;
        max-height: 55px;
        max-width: 55px;
        object-fit:contan;
    }
    .logo__title{
        color: #4e6071;
        margin-left:8px;
        font-size: 20px;
    }
    .dropdown-container{
        position: relative;
    }
    .dropdown-content{
        min-width: 100%;
        position: absolute;
        top: 58px;
        left:0;
        background: #f7f7f7;
        border: 2px solid transparent;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
    }
    .no-border-bottom-radius{
        border-bottom-right-radius:0;
        border-bottom-left-radius: 0;
    }
    .search-result-item{
        padding-bottom: 3px;
        display:grid;
        grid-template-columns: auto 75% auto;
    }
    .search-result-item:hover{
        background: #ddd;
    }
    .search-result-icon{
        padding: 10px 16px;
    }
    table.search-result-data > tbody > tr:nth-child(2){
        font-size:13px;
        color:#585050;
    }
    .label-txt {
        color: #585050;
    }
    .advanced-search input {
        border-bottom: 1px solid black;
        margin: 0;
        padding: 0;
        height: 30px;
    }
    .advanced-search select {
        width: 100%;
        height: 28px;
        border: none;
        border-bottom: 1px solid black;
        background: transparent;
        outline: none;
        padding: 0;
        margin: 0;
    }
    .advanced-search input[type="checkbox"] {
        height: 15px;
    }
</style>