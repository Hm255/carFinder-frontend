<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchCars, type Car } from '../services/api.ts';
import CarComparison from './CarComparison.vue'; // Import the comparison component

const cars = ref<Car[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);


const comparisonList = ref<Car[]>([]);

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

// Function to add or remove a car from comparison
const toggleCompare = (car: Car) => {
  const index = comparisonList.value.findIndex(c => c.registration_number === car.registration_number);
  if (index >= 0) {
    // Remove from comparison
    comparisonList.value.splice(index, 1);
  } else {
    if (comparisonList.value.length < 3) {
      // Add to comparison
      comparisonList.value.push(car);
    } else {
      alert('You can compare up to 3 cars.');
    }
  }
};

// Function to check if a car is in the comparison list
const isInComparison = (car: Car) => {
  return comparisonList.value.some(c => c.registration_number === car.registration_number);
};
</script>

<template>
  <div class="car-list">
    <h1>Car List</h1>
    <div v-if="loading">Loading cars...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="car-cards">
      <div v-for="car in cars" :key="car.registration_number" class="car-card">
        <h2>{{ car.make }} {{ car.model }}</h2>
        <ul>
          <li><strong>Color:</strong> {{ car.color }}</li>
          <li><strong>Engine Size:</strong> {{ car.engine_size }} cc</li>
          <li><strong>Year of Manufacture:</strong> {{ car.year_of_manufacture }}</li>
          <li><strong>CO₂ Emissions:</strong> {{ car.co2_emissions }} g/km</li>
          <li><strong>Fuel Type:</strong> {{ car.fuel_type }}</li>
          <li><strong>Wheel Plan:</strong> {{ car.wheel_plan }}</li>
          <li><strong>Power Output:</strong> {{ car.power_output }} HP</li>
          <li><strong>Price:</strong> £{{ car.price }}</li>
        </ul>
        <button @click="toggleCompare(car)" :disabled="!isInComparison(car) && comparisonList.length >= 3">
          {{ isInComparison(car) ? 'Remove from Comparison' : 'Add to Comparison' }}
        </button>
      </div>
    </div>

    <!-- Comparison Component -->
    <CarComparison :comparisonList="comparisonList" />
  </div>
</template>

<style scoped>
.car-list {
  padding: 16px;
}

.car-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.car-card {
  border: 1px solid #ddd;
  padding: 16px;
  width: 300px;
  box-sizing: border-box;
  flex-shrink: 0;
  transition: border-color 0.3s;
}

.car-card h2 {
  margin-top: 0;
}

.car-card ul {
  list-style-type: none;
  padding: 0;
}

.car-card ul li {
  margin-bottom: 8px;
}

.car-card button {
  margin-top: 16px;
}

.in-comparison {
  border-color: #2196f3; /* Highlighted border color */
}
</style>
