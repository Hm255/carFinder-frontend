import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import CarList from '../components/CarList.vue'
import HomePage from '../components/HomePage.vue'
import CarComparison from '../components/CarComparison.vue';
import Favourites from '../components/Favourites.vue';
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
    component: CarComparison,
  },
  {
    path: '/favourites', // Use the correct path
    name: 'Favourites',
    component: Favourites,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
