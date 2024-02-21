import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../pages/Home"
import AuthCallback from "../pages/Auth-callback"
import Box from "../pages/Box";
import Profile from "../pages/Profile";
import Referral from "../pages/Referral";
import Partner from "../pages/Partner";
import Cooperation from "../pages/Cooperation";
import Faq from "../pages/Faq";
import Chat from "../pages/Chat";
import User from "../pages/User";
import Bust from "../pages/Bust";
import Upgrade from "../pages/Upgrade";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/auth/steam',
        name: 'AuthCallback',
        component: AuthCallback
    },
    {
        path: '/box/:url',
        name: 'Box',
        component: Box
    },
    {
        path: '/user/:id',
        name: 'User',
        component: User
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/r/:ref',
        name: 'Referral',
        component: Referral
    },
    {
        path: '/partner',
        name: 'Partner',
        component: Partner
    },
    {
        path: '/cooperation',
        name: 'Cooperation',
        component: Cooperation
    },
    {
        path: '/faq',
        name: 'Faq',
        component: Faq
    },
    {
        path: '/chat',
        name: 'Chat',
        component: Chat
    },
    {
        path: '/bust',
        name: 'Bust',
        component: Bust
    },
    {
        path: '/upgrade',
        name: 'Upgrade',
        component: Upgrade
    },
    {
        path: "*",
        redirect: '/'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior () {
        return { x: 0, y: 0 }
    }
})

export default router
