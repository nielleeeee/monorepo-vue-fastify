import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('../views/ShopView.vue'),
    },
    {
      path: '/shop/:id',
      name: 'shop-id',
      component: () => import('../views/SingleItemView.vue'),
      props: true,
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateItemVew.vue'),
    },
    {
      path: '/workflow',
      name: 'workflow',
      component: () => import('../views/WorkflowView.vue'),
    },
    {
      path: '/email-workflow',
      name: 'email-workflow',
      component: () => import('../views/EmailWorkflowView.vue'),
    },
  ],
})

export default router
