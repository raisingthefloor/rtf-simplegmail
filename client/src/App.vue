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
    <router-view />
  </div>  
</template>

<script>
import axios from 'axios';
//import store from './store/store';
import Home from './components/Home.vue';
import GoogleCallback from './components/GoogleCallback.vue';
import Login from './components/authentication/Login.vue';
export default{
  components: {
    Home,
    'google-callback': GoogleCallback,
    'login': Login
  },

  beforeCreate(){
    const self = this;
    if(localStorage.getItem('appActiveUser')){
      let payload = JSON.parse(localStorage.getItem('appActiveUser'));
      this.$store.commit('UPDATE_USER', payload);
    }
    /*if(!this.$store.state.appActiveUser.isAuthenticated){
      this.$router.push('/login');
    } */
    
    //request interceptors
    axios.interceptors.request.use(async config => {
      if(self.$store.state.appActiveUser.token != null || self.$store.state.appActiveUser.token !== "")
      {
        config.headers.authorization = 'Bearer ' + self.$store.state.appActiveUser.token;
        return config;
      }
      else
      {
        return config;
      }
    })
  }
}
</script>

