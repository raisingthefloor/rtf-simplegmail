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