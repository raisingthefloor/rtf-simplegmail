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
        <h1 class="h3 mb-3 fw-normal">Delete Account</h1>
          <div class="form-floating">
            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="email" autofocus>
            <label for="floatingInput">Email Address</label>
          </div>

          <button class="w-100 btn btn-lg btn-danger mt-2" :disabled="!email.length" type="submit">
            <span>Delete</span>
          </button>
      </form>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
            email: ''
        }
    },

    methods:{
        onSubmit(){
            if(this.email){
                axios.get(`api/users/google/delete?email=${this.email}&isDelete=true`)
                    .then(res => {
                      alert(res.data.message);
                      this.email = '';
                    })
                    .catch(e => console.log(e));
            }
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
    .form-signin input[type="email"] {
        margin-bottom: -1px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }
</style>