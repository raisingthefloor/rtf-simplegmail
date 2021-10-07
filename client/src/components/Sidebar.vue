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
        <!-- Menu Bar area start -->
        <div class="menu__bar">
            <div class="write__email__btn">
                <router-link to="/mail-compose" class="common__btn">
                    <span><img src="/assets/img/pen.png" alt=""></span>Write <br> New email
                </router-link>
            </div>
            <div class="main__menu__wrapper">
                <div class="main_menu">
                    <!-- <ul>
                        <li>
                            <router-link to="/drafts">
                                <span><img src="/assets/img/pencil.png" alt=""></span>DRAFTS Not Sent
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/inbox" :class="$route.name == 'Inbox' ? 'active' : ''">
                                <span><img src="/assets/img/inbox.png" alt=""></span>Inbox 
                                <div class="new__mail new__notifications">2 new</div>
                            </router-link>
                        </li>
                        <li>
                            <a href="#">
                                <div class="ml-2"></div> ? Junk mail ?
                            </a>
                        </li>
                        <li>
                            <router-link to="/sent">
                                <span><img src="/assets/img/folder.png" alt=""></span>Email I SENT
                            </router-link>
                        </li>
                        <li>
                            <a><span><img src="/assets/img/folder.png" alt=""></span>SAVED email</a>
                        </li>
                        <li>
                            <router-link to="/trash">
                                <span><img src="/assets/img/trash-1.png" alt=""></span> email in TRASH
                            </router-link>
                        </li>
                    </ul> -->
                    <ul @keydown="onLabelsKeyDown">
                        <li v-for="(label,index) in filteredLabels" :id="`lbl_id_${index}`" :key="label.id" :ref="`label_${index}`" @click="currentIndex = index" class="label-item">
                            <router-link :to="`/${label.route}`" :class="$route.path == '/'+label.route ? 'active' : ''">
                                <span>
                                    <img v-if="label.imgSrc" :src="label.imgSrc" :alt="label.id">
                                </span> 
                                {{label.text}}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="add__new__folder text-center">
                <a href="#" class="common__btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Add New Folder</a>
            </div>
            <div class="menu__bottom">
                <a href="javascript:void(0)"><i class="fas fa-user"></i></a>
                <a href="javascript:void(0)" class="active"><img src="/assets/img/google-hangouts-logo.png" alt=""></a>
                <a href="javascript:void(0)"><i class="fas fa-phone fa-rotate-90"></i></a>
            </div>
        </div>
        <!--Menu Bar area end -->
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data(){
        return{
            allowedSystemLabels:['draft', 'inbox', 'spam', 'sent', 'trash'],
            currentIndex: 0
        };
    },

    props:{
        labels:{
            type: Array,
            required: true
        }
    },

    watch:{
        currentIndex(newVal){
            if(newVal === 0){
                setTimeout(() => {
                    document.querySelector('.main_menu').scrollTop = 0;
                }, 0);
            }
        }
    },

    computed:{
        filteredLabels(){
            if(this.labels.length){
                return this.labels.filter(label => {
                    if((label.type == "system" && this.allowedSystemLabels.includes(label.name.toLowerCase())) || label.type == "user"){
                        return true;
                    } 
                    return false; 
                }).map(label => {
                    let text = "", route = label.name.toLowerCase(), imgSrc="/assets/img/";
                    if(label.name == "SENT"){
                        text = "Email I SENT";
                        imgSrc += "folder.png";
                    }
                    else if(label.name == "INBOX"){
                        text = "Inbox";
                        imgSrc += "inbox.png";
                    }
                    else if(label.name == "TRASH"){
                        text = "email in TRASH";
                        imgSrc += "trash-1.png";
                    }
                    else if(label.name == "SPAM"){
                        route = "spam";
                        text = "? Junk mail ?";
                        imgSrc += "folder.png";
                    }
                    else if(label.name == "DRAFT"){
                        imgSrc += "pencil.png";
                        route += 's';
                        text = "DRAFTS - Not Sent";
                    }
                    else{
                        imgSrc += "folder.png";
                        text = label.name; 
                    }
                    return Object.assign({}, label, {text, route, imgSrc});
                });
            }
            else{
                return [];
            }
        },

        ...mapState(['keyCodes'])
    },

    methods: {
        onLabelsKeyDown(e){
            const {arrows} = this.keyCodes;
            switch(e.keyCode){

                case arrows.right:
                    this.rightArrowClicked();
                    break;

                case arrows.up:
                    this.traverseLabelsUp();
                    break;
                
                case arrows.down:
                    this.traverseLabelsDown();
                    break;

                default:
                    break;
            }
        },

        rightArrowClicked(){
            //check current route
            let {path} = this.$route;
            if(path == "/mail-compose"){
                //relay focus to MailComposer Component
                this.currentIndex = 0;
                this.relayFocusToMailComposer();
            }
            else if(path == '/inbox'){
                this.currentIndex = 0;
                //relay focus to Inbox Component
                this.relayFocusToInbox();
            }
        },

        traverseLabelsDown(){
            //alert("down");
            this.currentIndex = (this.currentIndex + 1) % this.filteredLabels.length;
            let li = window.$(this.$refs['label_'+this.currentIndex]);
            let element = li.find('a');
            element.focus();
        },

        traverseLabelsUp(){
            this.currentIndex = (this.currentIndex - 1 + this.filteredLabels.length) % this.filteredLabels.length;
            let li = window.$(this.$refs['label_'+this.currentIndex]);
            let element = li.find('a');
            element.focus();
        },

        relayFocusToMailComposer(){
            //Set focus to first input element i.e to field
            window.$("#to").focus();
        },

        relayFocusToInbox(){
             //Set focus to message from the list
             window.$("#nav-home-tab-0").focus();
        }
    }
}
</script>

<style scoped>
    .main_menu::-webkit-scrollbar{
      display:block;
      width:8px;
    }
    .main_menu::-webkit-scrollbar-track {
      -webkit-box-shadow:inset 0 0 6px gray; 
      box-shadow: inset 0 0 6px gray;
      border-radius:5px;
    }
    .main_menu::-webkit-scrollbar-thumb {
      border-radius:5px;
      -webkit-box-shadow: inset 0 0 6px white; 
      box-shadow: inset 0 0 6px white;
    }
    .label-item{
        word-break: break-word;
    }
    /*Removing unwanted margin-bottom*/
    .main_menu ul{
        padding-top:5px;
        margin-bottom: unset;
    }
</style>