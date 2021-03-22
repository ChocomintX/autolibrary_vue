import Vue from 'vue'
import VueRouter from "vue-router"
import home from "@/views/home";

Vue.use(VueRouter)

export default new VueRouter({
    base:'/library/',
    routes: [
        {path: '/', component: home},
    ]
})