import Vue from 'vue'
import VueRouter from "vue-router"
import home from "@/views/home";
import searchSeat from "@/components/searchSeat";
import autoGrab from "@/components/autoGrab";
import login from "@/components/login";
import appointment from "@/components/appointment";

Vue.use(VueRouter)

export default new VueRouter({
    base:'/autolibrary/',
    routes: [
        {path: '/', component: home},
        {
            path: '/',
            component: home,
            children:[{
                path:'/searchSeat',
                component:searchSeat
            },{
                path:'/autoGrab',
                component:autoGrab
            },{
                path:'/appointment',
                component:appointment
            }]
        },
        {
            path:'/login',component:login
        },

    ]
})