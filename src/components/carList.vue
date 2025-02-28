<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchCars, type Car } from '../services/api.ts'
// import dayjs from 'dayjs';


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

// const formatDate = (date: string | Date | null): string => {
//   return date ? dayjs(date).format('MMM DD, YYYY') : 'N/A';
// }; // date formatting by taking a string and reformatting, dropping null handling and leaving date formatted data alone

onMounted(() => {
  loadCars();
});
</script>
<template>
  <div>
    <h1>Car List</h1>
    <div v-if="loading">Loading cars...</div>
    <div v-else-if="error">{{ error }}</div>
    <table v-else>
      <thead>
        <tr>
          <th>Car Name</th>
          <th>Color</th>
          <th>Engine Size</th>
          <th>Year of Manufacture</th>
          <th>CO₂ Emissions</th>
          <th>Fuel Type</th>
          <th>Wheel Plan</th>
          <th>Power Output</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in cars" :key="car.registration_number">
          
          <td>{{ car.make, car.model }}</td>
          
          <td>{{ car.color }}</td>
          <td>{{ car.engine_size }} cc</td>
          <td>{{ car.year_of_manufacture }}</td>
          
          <td>{{ car.co2_emissions }} g/km</td>
          


          <td>{{ car.fuel_type }}</td>
         
          <td>{{ car.wheel_plan }}</td>
          <td>{{ car.power_output }} HP</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #e9e9e9;
}

h1 {
  margin-bottom: 16px;
}
</style>