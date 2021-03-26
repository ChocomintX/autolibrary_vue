import Vue from 'vue'
import App from './App.vue'
import router from "@/router/router";
import ElementUI from 'element-ui'
import axios from "axios";
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

axios.defaults.baseURL='https://chocomint.cn/autolibrary/api/'
Vue.prototype.$http=axios

Vue.prototype.$rooms=[{label: '东区6楼声像阅览室', value: '2062'}, {label: '东区6楼电子阅览室', value: '2063'},
  {label: '东区学习室3-6', value: '2036'}, {label: '东区学习室3-5', value: '2035'},
  {label: '东区学习室3-4', value: '2034'}, {label: '东区学习室3-3', value: '2033'},
  {label: '东区学习室3-2', value: '2032'}, {label: '东区学习室3-1', value: '2031'},
  {label: '东区学习室2-4', value: '2024'}, {label: '东区学习室2-2', value: '2022'},
  {label: '东区学习室2-1', value: '2021'}, {label: '西区电子阅览室', value: '1021'},
  {label: '西区学习室4-2', value: '1042'}, {label: '西区学习室4-1', value: '1041'},
  {label: '西区学习室3-2', value: '1032'}, {label: '西区学习室3-1', value: '1031'},
  {label: '西区学习室1-1', value: '1011'}, {label: '西区开放学习室1-2', value: '1012'}]

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
