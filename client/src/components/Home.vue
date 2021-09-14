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
        <Header />
        <Sidebar />
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
                      <div class="single-input-item">
                          <select class="form-select int" name="" id="">
                              <option v-for="number in 4" :key="number" :option="number">{{number}}</option>
                          </select>
                      </div>
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
//import { mapState } from 'vuex';
export default{
  components: {
    Header,
    Sidebar,
    MainArea
  },

  data(){
    return {
      labels: []
    }
  },

  /*created(){
    this.loadGoogleClient();
    //Generate google auth code if it does not already exists
    if(!this.$store.state.appActiveUser.hasGoogleAuth){
      this.apiConnect();
    }  
  },

  beforeMount(){
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

    //...mapState(['googleCreds'])
  },

  /*watch:{
    
  },*/

  methods:{
    //connects with goole api
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
    },

    createLabelClicked(e){
      e.preventDefault();
      if(this.labelName){
        gapi.client.gmail.users.labels.create({
          userId: 'me',
          resource: {
            "labelListVisibility": "labelShow",
            "messageListVisibility": "show",
            "name": this.labelName,
            "type": "user"
          }
        })
        .then(res => {
          $('#close-modal').click();
          console.log(res);
          this.loadGmailLabels();
        })
        .catch(e => console.log(e));
      }
    }*/
  }
}
</script>