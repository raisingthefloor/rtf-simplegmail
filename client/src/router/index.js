import { createWebHistory, createRouter } from "vue-router";
import {store} from "../store/store";

const routes = [
    {
        path: "/",
        component: () => import('../components/Home.vue'),
        meta:{
            requiresAuth: true
        },
        children: [
            {
                path: '/:pathMatch(.*)',
                component: () => import('../components/NoMail.vue')
            },
            {
                path: "/inbox",
                name: "Inbox",
                component: () => import('../components/Inbox.vue')
            },
            {
                path: "/sent",
                name: "Sent",
                component: () => import('../components/Sent.vue')
            },
            {
                path: "/drafts",
                name: "Drafts",
                component: () => import('../components/Drafts.vue')
            },
            {
                path: "/address-book",
                name: "AddressBook",
                component: () => import('../components/AddressBook.vue')
            },
            {
                path: "/trash",
                name: "Trash",
                component: () => import('../components/Trash.vue')
            },
            {
                path: "/mail-compose",
                name: "MailCompose",
                component: () => import('../components/MailComposer.vue')
            },
        ]
    },
    
    {
        path: "/googlecallback",
        name: "GoogleCallback",
        component: () => import('../components/GoogleCallback.vue')
    },
    
    {
        path: "/login",
        name: "Login",
        component: () => import('../components/authentication/Login.vue')
    },
    {
        path: "/register",
        name: "Register",
        component: () => import('../components/authentication/Register.vue')
    },
    {
        path: "/account-delete",
        name: "DeleteAccount",
        component: () => import('../components/authentication/DeleteAccount.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to) => {
    if(to.meta.requiresAuth && !store.state.appActiveUser.isAuthenticated){
        return {path: '/login'}
    }
});
export default router;