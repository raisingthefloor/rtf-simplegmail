<template>
    <div>
        <Header />
        <Sidebar />
        <MainArea />
    </div>
</template>
<script>
import axios from 'axios';
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import MainArea from './MainArea.vue';
export default{
  components: {
    Header,
    Sidebar,
    MainArea
  },

  created(){
    //Generate google auth code if it does not already exists
    if(!this.$store.state.appActiveUser.hasGoogleAuth){
      this.apiConnect();
    }  
  },

  methods:{
    //connects with goole api
    apiConnect(){
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
    }
  }
}
</script>