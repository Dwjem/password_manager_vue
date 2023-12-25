import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        name: 'Home',
        component: ()=> import('../view/index/index')
    },
    {
        path: '/login',
        name: 'Login',
        component: ()=> import('../view/login/login')
    },
    {
        path: '/password',
        name: 'Password',
        component: ()=> import('../view/password/password.vue')
    },
    {
        path: '/demo',
        name: 'demo',
        component: ()=> import('../view/demo.vue')
    }
]

const router = createRouter({
    history: createWebHistory("/password_manager_vue/"),
    routes
})

export default router
