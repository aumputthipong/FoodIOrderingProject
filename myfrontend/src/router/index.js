import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        meta: { guess: true },
        component: () => import('../views/HomePage') // set home as path '/'
    },
    {
        path: '/shop/detail/:id',
        name: 'ShopDetail',
        meta: { guess: true },
        component: () => import('../views/detail/ShopDetail.vue')
    },
    {
        path: '/create/createshop',
        name: 'createshop',
        meta: { login: true },
        component: () => import('../views/create/CreateShop.vue')
    },
    {
        path: '/createproduct/:shopid',
        name: 'createproduct',
        meta: { login: true },
        component: () => import('../views/create/CreateProduct.vue')
    },
    {
        path: '/user/signup',
        name: 'signup',
        meta: { guess: true },
        component: () => import('../views/SignUp.vue')
    },
    {
        path: "/user/login",
        name: 'login',
        meta: { guess: true },
        component: () => import("../views/LoginComponent.vue")
    },
    {
        path: "/cartdetail",
        name: 'cart',
        meta: { login:true},
        component: () => import("../views/detail/CartDetail.vue")
    },
    {
        path: '/shopupdate/:id',
        name: 'update-shop',
        component: () => import('../views/update/UpdateShop.vue')
    },
    {
        path: '/productupdate/:id',
        name: 'product-shop',
        component: () => import('../views/update/UpdateProduct.vue')
    },
    {
        path: '/queuedetail',
        name: 'queue-detail',
        component: () => import('../views/detail/QueueDetail.vue')
    },
    {
        path: '/queuemanage',
        name: 'queue-management',
        component: () => import('../views/create/QueueManage.vue')
    },

];

const router = new VueRouter({ routes });

router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem('token')

    if (to.meta.login && !isLoggedIn) {
        alert('Please login first!');
        next({ path: '/user/login' });
    }

    next();
});

export default router
