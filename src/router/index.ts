import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import CarList from '../components/CarList.vue'
import HomePage from '../components/HomePage.vue'
import CarComparison from '../components/CarComparison.vue';
import Favourites from '../components/Favourites.vue';
import CarInfo from '../components/CarInfo.vue';
import Payment from '../components/Payment.vue';
import PaymentComplete from '../components/PaymentComplete.vue';
import GlobalErrorDisplay from '../components/GlobalErrorDisplay.vue';


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
    path: '/Favourites', 
      name: 'Favourites',
    component: Favourites,
  },
  {
    path: '/cars/:registrationNumber',
    name: 'CarInfo',
    component: CarInfo,
  },
  {
    path: '/cars/:registrationNumber/payment',
    name: 'Payment',
    component: Payment,
  },
  {
    path: '/cars/:registrationNumber/payment/PaymentComplete', 
    name: 'PaymentComplete',
    component: PaymentComplete,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: GlobalErrorDisplay,
    props: { notFound: true }
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
