<template>
    <h2>Processing...</h2>
</template>

<script>
import axios from 'axios';
export default {
    name: 'GoogleCallback',

    mounted(){
        this.runGoogleCallback();
    },

    methods:{
        runGoogleCallback(){
            let code = this.$route.query.code;
            //this.$store.commit('updateCode', code);
            if(code){
                axios.post('api/googlecallback', {code})
                .then(response => {
                    if(!response.data.data.error){
                        if(response.data.data.hasGoogleAuth){
                            const {hasGoogleAuth} = response.data.data;
                            this.$store.commit('UPDATE_USER', {hasGoogleAuth});
                            //go to inbox after google auth code is procured for the user
                            this.$router.push('/inbox');
                        }
                    }
                })
                .catch(err => console.log(err))
            }
        }
    }
}
</script>