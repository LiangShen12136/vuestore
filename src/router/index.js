import Vue from 'vue'
import VueRouter from 'vue-router'

const Login=()=>import('../components/Login.vue')
const Home=()=>import('../components/Home.vue')
const Welcome=()=>import('../components/Welcome.vue')
const Users=()=>import('../components/users/Users.vue')
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login,
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
      path:'/welcome',
      component:Welcome,
      },
      {
        path:'/users',
        component:Users,
      },
    ]
  },
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // to将要访问的路径
  // from从哪个路径过来
  // next放行函数
  if(to.path=='/login') return next();
  const tokenStr=window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
})
export default router
