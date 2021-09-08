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
    if(!this.$store.state.appActiveUser.isAuthenticated){
      this.$router.push('/login');
    } 
    
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

