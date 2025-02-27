import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import CarList from '../components/CarList.vue'

const routes: Array<RouteRecordRaw> = [
  // ... other routes
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
