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
    <div class="text-center mt-4">
        <main class="form-signin">
            <div class="loader">Please wait...</div>
        </main>
    </div>
</template>

<script>
import axios from 'axios';
import * as Sentry from "@sentry/vue";
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
                            this.$store.commit('UPDATE_USER', response.data.data);
                            //go to inbox after google auth code is procured for the user
                            this.$router.push('/inbox');
                        }
                    }
                    else{
                        alert('Oops! Something went wrong. Please try again later');
                        this.$router.push('/login');        
                    }
                })
                .catch(err => {
                    Sentry.captureException(err);
                })
            }
            else{
                this.$router.push('/login');
            }
        }
    }
}
</script>