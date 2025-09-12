<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { fetchCars, type Car } from '../services/api'; 

const route = useRoute();
const router = useRouter();

const registrationNumber = ref<string | undefined>(undefined); 
const car = ref<Car | null>(null); 
const loading = ref(true); 
const error = ref<string | null>(null); 

onMounted(async () => {
  registrationNumber.value = route.params.registrationNumber as string | undefined;

  if (!registrationNumber.value) {
    error.value = 'Registration number is missing.';
    loading.value = false; 
    return;
  }

  try {
    const allCars = await fetchCars();
    const foundCar = allCars.find(c => c.registration_number === registrationNumber.value);

    if (foundCar) {
      car.value = foundCar;
    } else {
      error.value = 'Car not found.';
    }
  } catch (err) {
    error.value = 'Failed to load car details.';
    
  } finally {
    loading.value = false;
  }
});

const completePayment = () => {
  if (registrationNumber.value) {
    router.push({
      name: 'PaymentComplete',
      params: { registrationNumber: registrationNumber.value },
    });
  } else {
   throw error
  }
};
</script>

<template>
  <div>
    <h1>Payment Page</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="car">
      <p>Are you sure? You can always come back later. Your Car is: {{ car.make }} {{ car.model }} ({{ car.registration_number }}) for £{{car.price}}</p>
      <button @click="completePayment" class="payment-button">Complete Payment</button>
    </div>
    <div v-else>
        <p>No car data available.</p> </div>

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

.payment-button:hover {
  background-color: #e0ac00;
}

h1 {
  color: var(--text-color);
}
p {
  color: var(--text-color);
}
</style>