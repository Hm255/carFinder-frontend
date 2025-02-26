import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import carList from '../components/carList.vue';

const routes: Array<RouteRecordRaw> = [
  // ... other routes
  {
    path: '/cars',
    name: 'CarList',
    component: carList,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
