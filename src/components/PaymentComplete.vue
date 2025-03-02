<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { fetchCars, type Car } from '../services/api';


const route = useRoute();
const registrationNumber = ref<string | null>(null);
const car = ref<Car | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    registrationNumber.value = route.params.registrationNumber as string; // Get reg number
    if (!registrationNumber.value) {
      throw new Error('Registration number is required'); //best practice to throw error
    }
     const cars = await fetchCars(); // Get car data
     const foundCar = cars.find(c => c.registration_number === registrationNumber.value);

     if (foundCar) {
          car.value = foundCar; // Set car value
        } else {
          error.value = 'Car not found.';
        }

  } catch (err: any) {
    error.value = err.message || 'An error occurred.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="payment-complete">
    <h1>Payment Complete</h1>

    <div v-if="loading">
        <p>Loading car details...</p>
    </div>
    <div v-else-if="error">
        <p>Error getting car details.</p>
    </div>

    <div v-else-if="car">
    <p>Thank you for your purchase of the {{ car.make }} {{ car.model }} ({{ registrationNumber }})!</p>
        </div>
     <div v-else>
      <p>Car Details not found.</p>
    </div>

  </div>
</template>

<style scoped>
.payment-complete {
  padding: 20px;
  text-align: center;
    max-width: 800px;
    margin: 0 auto;
}

.payment-complete h1 {
  margin-bottom: 1rem;
    color: var(--text-color);
}
</style>