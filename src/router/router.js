import Vue from 'vue'
import VueRouter from "vue-router"
import home from "@/views/home";
import searchSeat from "@/components/searchSeat";
import autoGrab from "@/components/autoGrab";
import login from "@/components/login";
import appointment from "@/components/appointment";
import cancelSeat from "@/components/cancelSeat";
import searchPeople from "@/components/searchPeople";

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
            },{
                path:'/cancelSeat',
                component:cancelSeat
            },{
                path:'/searchPeople',
                component:searchPeople
            }]
        },
        {
            path:'/login',component:login
        },

    ]
})