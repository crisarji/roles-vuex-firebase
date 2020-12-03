import Vue from 'vue';
import Router from 'vue-router';
import { auth } from '../firebase';

const routerOptions = [
  { path: '/', component: 'Landing', meta: { requiresAuth: true } },
  { path: '/auth', component: 'Auth' },
  { path: '/landing', component: 'Landing', meta: { requiresAuth: true } },
  { path: '/dashboard', component: 'Dashboard', meta: { requiresAuth: true } },
  { path: '*', component: 'Auth' },
];

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(/* webpackChunkName: "{{route.component}}" */ `../views/${route.component}.vue`)
  };
});

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  auth.onAuthStateChanged(userAuth => {
    if (userAuth) {
      auth.currentUser.getIdTokenResult()
        .then(({claims}) => {
          if (claims.admin) {
            if (to.path !== '/dashboard')
              return next({
                path: '/dashboard',
              });
          }
          if (claims.player) {
            if (to.path !== '/landing')
              return next({
                path: '/landing',
              });
          }
        })
    } 
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = auth.currentUser;
    if (requiresAuth && !isAuthenticated) {
      next('/auth');
    } else {
      next();
    }
  })
  next();
});

export default router
