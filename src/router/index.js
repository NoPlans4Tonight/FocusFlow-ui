import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Logout from '../components/Logout.vue';
import { useUserStore } from '../store/userStore';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isAuthenticated;

  if (!isAuthenticated && (to.name !== 'Login' && to.name !== 'Register')) {
    next({ name: 'Login' });
  } else if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;