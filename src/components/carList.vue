<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchCars, type Car } from '../services/api.ts'

const cars = ref<Car[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const loadCars = async () => {
  try {
    cars.value = await fetchCars();
  } catch (err: any) {
    error.value = 'Failed to load cars.';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCars();
});
</script>
<template>
<div>
    <h1>Car List</h1>
    <div v-if="loading">Loading cars...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="car in cars" :key="car.registration_number">
        {{ car.registration_number }} {{ car }} ({{ car.year_of_manufacture }})
      </li>
    </ul>
  </div>
</template>
<style lang="css" scoped>
/* more to come in future */
</style>