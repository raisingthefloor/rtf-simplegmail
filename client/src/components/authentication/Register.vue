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
    <main class="form-signin text-center">
      <form @submit.prevent="registerNewUser">

        <h1 class="h3 mb-3 fw-normal">Register</h1>
        <!-- <div class="form-floating">
          <p v-show="showError" style="color: red; font-size: 15px;">
            <span v-show="!nodeErrorArr.length" v-html="$t('register_client_validation')">
            </span>
            <span v-show="nodeErrorArr.length">
              {{ $t('please_fill_all_details_correctly') }} <br>
              <span v-for="(nodeError, index) in nodeErrorArr" :key="'error'+index">
                {{ nodeError.msg }} <br>
              </span>
            </span>
          </p>
        </div> -->
        <div class="mb-3" style="text-align: left !important;">
          <label for="account_name">Full name</label>
          <input type="text" class="form-control" v-model="newUser.name" id="account_name" autofocus required>
        </div>
        <!-- <div class="mb-3" style="text-align: left !important;">
          <label for="account_nickname">{{ $t('account_nickname') }}</label>
          <input type="text" class="form-control" id="account_nickname" :placeholder="$t('account_nickname_placeholder')" v-model="account_nickname" required>
        </div> -->
        <div class="mb-3">
          <!-- <div class="mb-3" style="text-align: left !important;">
            <label for="name">{{ $t('name') }}</label>
            <input type="text" class="form-control" id="name" :placeholder="$t('enter_your_full_name')" v-model="name" required>
          </div> -->

          <div class="mb-3" style="text-align: left !important;">
            <label for="email">Email Address</label>
            <input type="email" class="form-control" id="email" v-model="newUser.email" placeholder="name@example.com" required>
          </div>

          <div class="" style="text-align: left !important;">
            <label for="password">Password</label>
            <input type="password" class="form-control" v-model="newUser.password" id="password"  min="8" max="15" required>
          </div>
          
        </div>


        <button class="w-100 btn btn-lg btn-primary" type="submit">
          <span>Submit</span>
        </button>

        <p class="mt-4">
            Already a user?<router-link to="/login" class="mt-4">Login</router-link>
        </p>

      </form>

    </main>

  </div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
            newUser:{
                name: null,
                email: null,
                password: null
            }
        }
    },

    methods:{
        registerNewUser(){
            axios.post('api/users/register', this.newUser)
            .then(payload => {
                const {name, email, hasGoogleAuth, isAuthenticated, token} = payload.data.data;
                if(!payload.data.error && isAuthenticated){
                    this.$store.commit('UPDATE_USER', {name, email, hasGoogleAuth, isAuthenticated, token});
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
  max-width: 330px;
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