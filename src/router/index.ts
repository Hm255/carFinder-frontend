import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import CarList from '../components/CarList.vue'
import HomePage from '../components/HomePage.vue'
import ComparisonPage from '../components/ComparisonPage.vue';

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
  {
    path: '/ComparisonPage',
    name: 'ComparisonPage',
    component: ComparisonPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
