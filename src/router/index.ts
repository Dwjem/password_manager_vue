import {createRouter, createWebHistory} from 'vue-router'
import useMenuList from "@/store/menuList"
import {storeToRefs} from "pinia";


const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../view/index/index')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../view/login/login')
    },
    {
        path: '/password',
        name: 'Password',
        component: () => import('../view/password/password.vue')
    },
    {
        path: '/demo',
        name: 'demo',
        component: () => import('../view/demo.vue')
    }
]

const router = createRouter({
    history: createWebHistory("/password_manager_vue"),
    routes
})

// 路由导航拦截
// - 进行任何的路由跳转之前，传入到beforeEach中的函数都会被回调
router.afterEach((to, from) => {
    const {setShowLoginOutBtn} = useMenuList();
    if (to.path == '/login') {
        // 登录页面不显示退出登录菜单
        setShowLoginOutBtn(false)
    } else {
        setShowLoginOutBtn(true)
    }
})


export default router
