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
        <div class="form-floating">
          <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="user.email" autofocus>
          <label for="floatingInput">Email Address</label>
        </div>
        <div class="form-floating">
          <input type="password" class="form-control" v-model="user.password" id="floatingPassword">
          <label for="floatingPassword">Password</label>
        </div>

        <button class="w-100 btn btn-lg btn-primary" type="submit">
          <span>Submit</span>
          <!-- <span v-if="loginSubmitClicked">{{ $t('processing') }}</span> -->
        </button>
 <div>
        
    </div>
        <p class="mt-4">Not a user? <router-link to="/register">Register</router-link> </p>

      </form>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
          user:{
            email: null,
            password: null
          }
        }
    },

    methods:{
      onSubmit(){
        //this.$router.push('/inbox');
        axios.post(`api/users/login`, this.user)
          .then(payload => {
            if(!payload.data.error && payload.data.data.isAuthenticated){
              this.$store.commit('UPDATE_USER', payload.data.data);
              this.$router.push('/');
            }
          })
          .catch(e => console.log(e));
      }
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
</style>