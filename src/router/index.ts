import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import CarList from '../components/CarList.vue'
import HomePage from '../components/HomePage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/cars',
    name: 'CarList',
    component: CarList,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
