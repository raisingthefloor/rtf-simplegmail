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
        <Header :profile-pic-url="profilePicUrl"/>
        <Sidebar :labels="labels" />
        <MainArea />

      <!-- Modal -->
      <div class="modal fade add__folder__popup" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">New Folder</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <div class="single-input-item">
                          <input type="text" v-model="labelName" class="int">
                      </div>
                      <!-- <div class="single-input-item">
                          <select class="form-select int" name="" id="">
                              <option v-for="number in 4" :key="number" :option="number">{{number}}</option>
                          </select>
                      </div> -->
                  </div>
                  <div class="modal-footer">
                      <button type="button" id="close-modal" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-primary" @click="createLabelClicked"
                        :class="[!$store.state.labelName.length ? 'disabled-btn' : '']" :disabled="!$store.state.labelName.length">
                        Create</button>
                  </div>
              </div>
          </div>
      </div>
      <!--Modal End-->
    </div>
</template>
<script>
//import axios from 'axios';
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import MainArea from './MainArea.vue';
import axios from 'axios';
import * as Sentry from "@sentry/vue";
import { mapState } from 'vuex';
export default{
  components: {
    Header,
    Sidebar,
    MainArea
  },

  data(){
    return {
      labels: [],
      profilePicUrl: ''
    }
  },
  
  created(){
    this.fetchGoogleLabels(); 
    //fetch profile pic url only if it is not available in the state
    if(!this.appActiveUser.profilePicUrl){
      this.getProfilePicUrl();
    }

    //add window resize event Listener
    window.addEventListener('resize', () => this.windowResizeHandler());
  },

  /*beforeMount(){
  },*/

  computed: {
    labelName:{
      get(){
        return this.$store.getters.labelName;
      },
      set(value){
        this.$store.commit('UPDATE_LABEL_NAME', value);
      }
    },

    ...mapState(['appActiveUser'])
  },

  /*watch:{
    
  },*/

  methods:{
    //connects with google api
    /*apiConnect(){
        axios.get('api/connect')
        .then(response => {
          if(response.data.data.url?.length && confirm("Do you want to connect with google ?")){
            window.location.href = response.data.data.url;
          }
          else if(!response.data.data.hasGoogleAuth){
            console.log(response.data);
            //this.$store.commit('UPDATE_USER', {hasGoogleAuth: true});
          }
        })
        .catch(err => console.log(err));
    },

    loadGoogleClient(){
      // Load the API client and auth2 library
      gapi.load('client:auth2', this.initGoogleClient);
    },

    initGoogleClient(){
      const {apiKey, clientId, discoveryDocs, scopes} = this.$store.state.googleCreds;
      
      gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        discoveryDocs: discoveryDocs,
        scope: scopes
      }).then(() => {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
          //console.log(gapi.auth2.getAuthInstance());
          // Handle the initial sign-in state.
          this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
      });
    },

    updateSigninStatus(isSignedIn){
      this.$store.commit('UPDATE_GOOGLE_AUTH_STATUS', isSignedIn);
      if(isSignedIn) this.loadGmailLabels();
    },

    googleLoginHandler(){
      gapi.auth2.getAuthInstance().signIn();
    },

    googleLogoutHandler(){
      gapi.auth2.getAuthInstance().signOut();
    },

    loadGmailLabels(){
      gapi.client.gmail.users.labels.list({
        userId: 'me'
      })
      .then(res => {
        this.labels = res.result.labels;
      })
      .catch(e => console.log(e));
    },*/

    createLabelClicked(e){
      e.preventDefault();
      if(this.labelName){
        let labelOptions = {
          "labelListVisibility": "labelShow",
          "messageListVisibility": "show",
          "name": this.labelName,
          "type": "user"
        };
        axios.post('api/users/me/labels/add', labelOptions)
          .then(res => {
            //$('#close-modal').click();
            document.querySelector('#close-modal').click();
            console.log(res);
            this.fetchGoogleLabels();
          })
          .catch(err => {
            Sentry.captureException(err);
          });
      }
    },

    fetchGoogleLabels(){
      axios('/api/users/me/labels')
        .then(res => {
          if(!res.data.error){
            this.labels = res.data.data;
          }
        })
        .catch(err => {
          Sentry.captureException(err);
        });
    },

    getProfilePicUrl(){
      axios.get('api/users/get-profile-pic')
        .then(res => {
          if(!res.data.error && res.data.data.length){
            this.profilePicUrl = res.data.data;
            this.$store.commit('UPDATE_USER', {profilePicUrl: this.profilePicUrl});
          }
        })
        .catch(err => {
          Sentry.captureException(err);
        })
    },

    windowResizeHandler(){
      //zoom level is 110%
      if(Math.floor(window.devicePixelRatio * 100) == 110){
        //remove other class
        window.$(".main_menu").removeClass('menu_adjusted_height_150 menu_adjusted_height_125 menu_adjusted_height_200 menu_adjusted_height_175'); 
        window.$(".main_menu").addClass('menu_adjusted_height_110'); 
      }
      //zoom level is 125%
      else if(Math.floor(window.devicePixelRatio * 100) == 125){
        window.$(".main_menu").removeClass('menu_adjusted_height_110 menu_adjusted_height_200 menu_adjusted_height_150 menu_adjusted_height_175'); 
        window.$(".main_menu").addClass('menu_adjusted_height_125');
      }
      //zoom level is 150%
      else if(Math.floor(window.devicePixelRatio * 100) == 150){
        window.$(".main_menu").removeClass('menu_adjusted_height_110 menu_adjusted_height_125 menu_adjusted_height_200 menu_adjusted_height_175'); 
        window.$(".main_menu").addClass('menu_adjusted_height_150');
      }
      else if(Math.floor(window.devicePixelRatio * 100) == 175){
        //remove other class
        window.$(".main_menu").removeClass('menu_adjusted_height_125 menu_adjusted_height_150 menu_adjusted_height_110 menu_adjusted_height_200'); 
        window.$(".main_menu").addClass('menu_adjusted_height_175');  
      }
      //zoom level is 200%
      else if(Math.floor(window.devicePixelRatio * 100) == 200){
        //remove other class
        window.$(".main_menu").removeClass('menu_adjusted_height_125 menu_adjusted_height_150 menu_adjusted_height_110 menu_adjusted_height_175'); 
        window.$(".main_menu").addClass('menu_adjusted_height_200'); 
      }
      else{
        //let regex = /[a-z_]*_\d*/;
        /*let matchedClass =  document.querySelector(".main_menu").classList.value.match(regex)[0];*/
        window.$(".main_menu").removeClass('menu_adjusted_height_150 menu_adjusted_height_125 menu_adjusted_height_110 menu_adjusted_height_200 menu_adjusted_height_175'); 
      }

      if(Math.floor(window.devicePixelRatio * 100) < 150){
        window.$('.menu__bar , .offcanvas-overlay').removeClass('show');
      }
    }
  }
}
</script>