<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'; 

const route = useRoute();
const router = useRouter();

const registrationNumber = route.params.registrationNumber;

const completePayment = () => {
  if (registrationNumber) {
    router.push({
      name: 'PaymentComplete',
      params: { registrationNumber: registrationNumber },
    });
  } else {
        console.error('Registration Number does not exist') 
};
}
</script>

<template>
  <div>
    <h1>Payment Page</h1>
    <p>This is a placeholder for the payment page for car with registration number: {{ registrationNumber }}</p>
    <button @click="completePayment" class = "payment-button">Complete Payment</button>
  </div>
</template>
<style scoped>
    
    .payment-button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        background-color: var(--primary-yellow);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-top: 1rem;
    }
    .payment-button:hover{
        background-color: #e0ac00;
    }
    h1{
        color: var(--text-color);
    }
</style>