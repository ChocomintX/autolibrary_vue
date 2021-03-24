import Vue from 'vue'
import App from './App.vue'
import router from "@/router/router";
import ElementUI from 'element-ui'
import axios from "axios";
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

axios.defaults.baseURL='http://localhost:5000/autolibrary/api/'
Vue.prototype.$http=axios

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
