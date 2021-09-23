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
  <div class="text-center" style="display: flex; align-items: center; padding-top: 40px; padding-bottom: 40px">
    <main class="form-signin">
      <form @submit.prevent="onSubmit">
        <h1 class="h3 mb-3 fw-normal">Login</h1>
        <!-- <div class="form-floating" v-show="showResendVerificationLink">
          <div class="alert alert-danger" role="alert" v-show="!sentVerificationEmail">
            <p>
              {{ $t('please_verify_your_email_to_continue') }} <br>
              {{ $t('it_may_take_upto_1_min_to_receive_the_email') }} <br> <br>
              <a href="javascript:void(0)" @click="resendVerificationLink" class="btn btn-sm btn-primary" v-if="!sendingVerificationEmail">{{
                  $t('resend_verification_email')
                }}</a>
              <a href="javascript:void(0)" disabled="true" class="btn btn-sm btn-primary" v-if="sendingVerificationEmail">{{
                  $t('sending_verification_email')
                }}</a>
            </p>
          </div>

          <div class="alert alert-success" role="alert" v-show="sentVerificationEmail">
            <p>{{ $t('verification_email_sent_to') }} {{ verificationLinkMail }}. <br></p>
          </div>

        </div>
        <div class="form-floating">
          <p style="color: red" v-show="showError">{{ $t('please_enter_correct_username_or_password') }}</p>
        </div> -->
        <!-- <div class="form-floating">
          <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="user.email" autofocus>
          <label for="floatingInput">Email Address</label>
        </div>
        <div class="form-floating">
          <input type="password" class="form-control" v-model="user.password" id="floatingPassword">
          <label for="floatingPassword">Password</label>
        </div>

        <button class="w-100 btn btn-lg btn-primary" type="submit">
          <span>Submit</span>
          <span v-if="loginSubmitClicked">{{ $t('processing') }}</span>
        </button>
        <hr /> -->
        <div @click="googleConnect" id="gSignInWrapper" class="mt-2">
          <div id="customBtn" class="customGPlusSignIn ">
            <span class="icon"></span>
            <span class="buttonText">{{gBtnTxt}}</span>
          </div>
        </div>
        
        <!-- <p class="mt-4">Not a user? <router-link to="/register">Register</router-link> </p> -->

      </form>
    </main>
    
  </div>
</template>

<script>
import axios from 'axios';
import * as Sentry from "@sentry/vue";
export default {
    data(){
        return{
          user:{
            email: null,
            password: null
          },
          gBtnTxt: 'Sign In With Google'
        }
    },

    mounted(){
      //this.renderGoogleButton();
      //this.loadGoogleClient();
    },

    methods:{
      googleConnect(){
        axios.get('api/connect')
        .then(res => {
          if(!res.data.error && res.data.url){
            window.location.href = res.data.url;
          }
        })
        .catch(err => {
          Sentry.captureException(err);
        });
      },

      /*onSubmit(){
        //this.$router.push('/inbox');
        axios.post(`api/users/login`, this.user)
          .then(payload => {
            if(!payload.data.error && payload.data.data.isAuthenticated){
              this.$store.commit('UPDATE_USER', payload.data.data);
              this.$router.push('/');
            }
          })
          .catch(e => console.log(e));
      },*/

      /*loadGoogleClient(){
        // Load the API client auth2 library
        this.gBtnTxt = "Please wait...";
        gapi.load('auth2', this.initGoogleClient);
      },

      gSignIn(promptType){
        gapi.auth2.getAuthInstance().signIn({prompt: promptType})
        .then(googleUser => {
          this.checkHasGoogleAuth(googleUser);   
        })
        .catch(e => console.log(e))
      },

      initGoogleClient(){
        const {clientId, discoveryDocs, scopes} = this.$store.state.googleCreds;
        gapi.auth2.init({
          client_id: clientId,
          discoveryDocs: discoveryDocs,
          scope: scopes,
          //response_type: 'code'
        }).then((res) => {
          const authInstance = window.gapi.auth2.getAuthInstance();
          authInstance.grantOfflineAccess()
          .then((res) => {
            this.googleCallback(res.code);
          })
          this.gSignIn();
          //this.checkHasGoogleAuth();
        })
        //this.attachSignInHandler(document.getElementById('customBtn'));
      },

      gAuthorize(){
        const {clientId, discoveryDocs, scopes} = this.$store.state.googleCreds;
        gapi.auth2.authorize({
          client_id: clientId,
          //discoveryDocs: discoveryDocs,
          scope: scopes,
          redirect_uri: 'http://localhost:3000/googlecallback',
          response_type: 'code'
        }, (res) => {
          this.googleCallback(res.code);
        });
      },

      getAuthCode(){
        const authInstance = window.gapi.auth2.getAuthInstance();
          authInstance.grantOfflineAccess()
          .then((res) => {
            this.googleCallback(res.code);
          });
      },

      checkHasGoogleAuth(authUser){
        const auth = gapi.auth2.getAuthInstance();
        const currentUser = authUser?.getBasicProfile() || auth.currentUser.get().getBasicProfile();
        let googleUser = {
          name: currentUser.getName(),
          email: currentUser.getEmail()
        }
        axios.post('api/users/google/status', googleUser)
          .then(res => {
            if(!res.data.error){
              const payload = res.data.data;
              if(!payload.hasGoogleAuth) this.getAuthCode();
              else if(payload.hasGoogleAuth){
                this.proceedWithLogin(payload.user);
              }
            }
          })
          .catch(e => console.log(e));
      },*/

      googleCallback(authCode){
        axios.post('api/googlecallback', {code: authCode})
          .then(res => {
            if(!res.data.data.error){
              if(res.data.data.hasGoogleAuth){
                this.proceedWithLogin(res.data.data);          
              }
            }
          })
        .catch(err => {
          Sentry.captureException(err);
        })
      },

      proceedWithLogin(userPayload){
        this.$store.commit('UPDATE_USER', userPayload);
        //go to inbox after google auth code is procured for the user
        this.$router.push('/inbox');
      },

      /*renderGoogleButton(){
        gapi.signin2.render('google-btn', {
          'width': 240,
          'height': 50,
          'longtitle': true,
          'theme': 'dark',
          'onsuccess': this.onLoginSuccess,
          'onfailure': this.onLoginError
        });
      },

      googleLogoutHandler(){
        const auth2Instance = gapi.auth2.getAuthInstance();
        auth2Instance.signOut();
      },

      onLoginSuccess(googleUser){
        const authResponse = googleUser.getAuthResponse();
        const baseProfile = googleUser.getBasicProfile();
        const googleProfile = {
          name: baseProfile.getName(),
          email: baseProfile.getEmail(),
          avatar: baseProfile.getImageUrl()
        }

        const payload = {authResponse, googleProfile};
        axios.post('api/users/store', payload)
          .then(res => {
            if(res.status == 200 && !res.data.error){
              this.$store.commit('UPDATE_USER', res.data.data);
              this.$router.push('/');
            }
          })
          .catch(e => console.log(e));
      },

      attachSignInHandler(element){
        const auth2Instance = gapi.auth2.getAuthInstance();
        auth2Instance.attachClickHandler(element, {}, this.onLoginSuccess, this.onLoginError);
      },

      onLoginError(error){
        console.log(error);
      },*/

      /*googleLoginHandler(){
        const {scopes, clientId} = this.$store.state.googleCreds;
        gapi.auth2.authorize({
          client_id: clientId,
          scope: scopes,
          response_type: 'code'
        }, (res) => {
          console.log(res);
        });
      },

      updateSigninStatus(isSignedIn){
        if(isSignedIn){
          const auth2 = gapi.auth2.getAuthInstance();
          console.log(auth2);
          const profile = auth2.currentUser.get().getBasicProfile();
          console.log(profile);
        }
      },*/
    }
}
</script>

<style scoped>
.form-signin {
  width: 100%;
  max-width: 400px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}

/**Google Sign In button styles */
#customBtn {
  display: inline-block;
  background: white;
  color: #444;
  width: 190px;
  border-radius: 5px;
  border: thin solid #888;
  box-shadow: 1px 1px 1px grey;
  white-space: nowrap;
}
#customBtn:hover {
  cursor: pointer;
}
span.label {
  font-family: serif;
  font-weight: normal;
}
span.icon {
  background: url('../../assets/img/g-normal.png') transparent 5px 50% no-repeat;
  display: inline-block;
  vertical-align: middle;
  width: 42px;
  height: 42px;
}
span.buttonText {
  display: inline-block;
  vertical-align: middle;
  padding-right: 42px;
  font-size: 14px;
  font-weight: bold;
}
</style>