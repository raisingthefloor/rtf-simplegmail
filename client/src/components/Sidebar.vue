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
        <!--------- Menu Bar area start --------->
    <div class="menu__bar">
        <div class="write__email__btn">
            <router-link to="/mail-compose" class="common__btn">
                <span><img src="/assets/img/pen.png" alt=""></span>Write <br> New email
            </router-link>
        </div>
        <div class="main__menu__wrapper">
            <div class="main_menu">
                <ul>
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
                </ul>
                <!-- <ul>
                    <li v-for="label in filteredLabels" :key="label.id">
                        <router-link :to="`/${label.route}`" :class="$route.path == '/'+label.route ? 'active' : ''">
                            <span>
                                <img v-if="label.imgSrc" :src="label.imgSrc" :alt="label.id">
                            </span> 
                            {{label.text}}
                        </router-link>
                    </li>
                </ul> -->
            </div>
        </div>
        <div class="add__new__folder text-center">
            <a href="#" class="common__btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Add New Folder</a>
        </div>
        <div class="menu__bottom">
            <a href=""><i class="fas fa-user"></i></a>
            <a href="" class="active"><img src="/assets/img/google-hangouts-logo.png" alt=""></a>
            <a href=""><i class="fas fa-phone fa-rotate-90"></i></a>
        </div>
    </div>
    <!--------- Menu Bar area end --------->
    </div>
</template>

<script>
//import { mapGetters } from 'vuex'
export default {
    data(){
        return{

        };
    },

    /*props:{
        labels:{
            type: Array,
            required: true
        }
    },*/

    computed:{
        /*filteredLabels(){
            if(this.labels.length){
                return this.labels.filter(label => {
                    if(label.name == "TRASH" || label.name == "SPAM") return true;
                    else if(label.name == "STARRED" || label.name == "UNREAD") return false;
                    return label.labelListVisibility != "labelHide"; 
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
                        route = "";
                        text = "? Junk mail ?";
                        imgSrc = null;
                    }
                    else if(label.name == "DRAFT"){
                        imgSrc += "pencil.png";
                        route += 's';
                        text = "DRAFTS Not Sent";
                    }
                    else{
                        imgSrc += "folder.png"
                        route = label.name;
                        text = label.name; 
                    }
                    return Object.assign({}, label, {text, route, imgSrc});
                });
            }
        },

        ...mapGetters(['isGoogleSignedIn'])*/
    },

    methods: {}
}
</script>

<style scoped>
    /*.main_menu::-webkit-scrollbar{
      display:block;
      width:8px;
    }
    .main_menu::-webkit-scrollbar-track {
      -webkit-box-shadow:inset 0 0 6px white; 
      box-shadow: inset 0 0 6px white;
      border-radius:5px;
    }
    .main_menu::-webkit-scrollbar-thumb {
      border-radius:5px;
      -webkit-box-shadow: inset 0 0 6px gray; 
      box-shadow: inset 0 0 6px gray;
    }*/
</style>