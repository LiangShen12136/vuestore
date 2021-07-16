import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import './assets/fonts/iconfont.css'

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http=axios
// Vue.prototype.$message=Message
// Vue.prototype.$confirm=MessageBox.confirm

//axios的请求拦截器
axios.interceptors.request.use(config=>{
  // console.log(config);
  // 在请求头中添加token验证的Authorization属性
  config.headers.Authorization=window.sessionStorage.getItem('token');
  // 最后一定要return config
  return config;
})

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
