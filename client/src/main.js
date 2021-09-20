import { createApp } from 'vue'
import {store} from './store/store';
import App from './App.vue';
import router from './router';
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

const app = createApp(App);

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
    trackComponents: true
});

app.config.devtools = true;
app.use(store);
app.use(router).mount('#app')

