/*
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
*/

import { createApp } from 'vue'
import {store} from './store/store';
import App from './App.vue';
import router from './router';
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

const app = createApp(App);
//Adding a global filter
app.config.globalProperties.$filters = {
  strip_html(str){
    if ((str===null) || (str==='') || str === undefined){
      return '';
    } 
    else{
      str = str.toString();
      return str.replace(/<[^>]*>/g, '').trim();
    }   
  }
};

Sentry.init({
    app,
    dsn: "https://2090e29cbe12426ca3e55109ae4fcf65@o464399.ingest.sentry.io/5888637",
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ["localhost", "my-site-url.com", /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    trackComponents: true,
    environment: process.env.VUE_APP_ENV
});

app.config.devtools = true;
app.use(store);
app.use(router).mount('#app')

