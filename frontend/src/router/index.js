import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/auth.store.js'

const router = createRouter({
    // history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginView
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue')
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/update',
            name: 'update',
            component: () => import('../views/ChangeTicketView.vue')
        },
        {
            path: '/ticket',
            name: 'ticket',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/TicketView.vue')
        }
    ]
})

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/', '/register']
    const authRequired = !publicPages.includes(to.path)
    const authStore = useAuthStore()

    if (authRequired && !authStore.token) {
        return {
            path: '/'
            // query: { returnUrl: to.href }
        }
    }
})

export default router
