<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetchCars } from '../services/api';
import type { Car } from '../services/api';
import { useRouter } from 'vue-router'; 

const cars = ref<Car[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedCars = ref<Car[]>([]);
const router = useRouter(); 

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

const isCarSelected = (car: Car) => {
  return selectedCars.value.some(
    (selectedCar) => selectedCar.registration_number === car.registration_number
  );
};

const toggleCarSelection = (car: Car) => {
  const index = selectedCars.value.findIndex(
    (selectedCar) => selectedCar.registration_number === car.registration_number
  );

  if (index === -1) {
    if (selectedCars.value.length < 3) {
      selectedCars.value.push(car);
    } else {
      alert('You can compare up to 3 cars.');
    }
  } else {
    selectedCars.value.splice(index, 1);
  }
};

const isSelectionLimitReached = computed(() => selectedCars.value.length >= 3);


const goToCarDetails = (car: Car) => {
  router.push({ name: 'CarInfo', params: { registrationNumber: car.registration_number } });
};
</script>

<template>
  <div class="car-comparison">
    <h1>Car Comparison</h1>

    <div v-if="loading">Loading cars...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="content-wrapper">
      <div class="car-cards">
        <div
          v-for="car in cars"
          :key="car.registration_number"
          :class="['car-card', { 'selected': isCarSelected(car), 'dimmed': isSelectionLimitReached && !isCarSelected(car) }]"
        >
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
          <button @click="toggleCarSelection(car)">
            {{ isCarSelected(car) ? 'Remove from Comparison' : 'Add to Comparison' }}
          </button>
        </div>
      </div>

      <h2 v-if="selectedCars.length > 0">Car Comparison</h2>
      <div v-if="selectedCars.length > 0" class="comparison">
        <table>
          <thead>
            <tr>
              <th>Specification</th>
              <th
                v-for="car in selectedCars"
                :key="car.registration_number"
                @click="goToCarDetails(car)"
                class="clickable-header"
              >
                {{ car.make }} {{ car.model }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Color</td>
              <td v-for="car in selectedCars" :key="car.registration_number + '-color'">
                {{ car.color }}
              </td>
            </tr>
            <tr>
              <td>Engine Size</td>
              <td v-for="car in selectedCars" :key="car.registration_number + '-engine'">
                {{ car.engine_size }} cc
              </td>
            </tr>
            <tr>
              <td>Year of Manufacture</td>
              <td v-for="car in selectedCars" :key="car.registration_number + '-year'">
                {{ car.year_of_manufacture }}
              </td>
            </tr>
            <tr>
              <td>CO₂ Emissions</td>
              <td v-for="car in selectedCars" :key="car.registration_number + '-co2'">
                {{ car.co2_emissions }} g/km
              </td>
            </tr>
            <tr>
              <td>Fuel Type</td>
              <td v-for="car in selectedCars" :key="car.registration_number + '-fuel'">
                {{ car.fuel_type }}
              </td>
            </tr>
            <tr>
              <td>Wheel Plan</td>
              <td v-for="car in selectedCars" :key="car.registration_number + '-wheel'">
                {{ car.wheel_plan }}
              </td>
            </tr>
            <tr>
              <td>Power Output</td>
              <td v-for="car in selectedCars" :key="car.registration_number + '-power'">
                {{ car.power_output }} HP
              </td>
            </tr>
            <tr>
              <td>Price</td>
              <td v-for="car in selectedCars" :key="car.registration_number + '-price'">
                {{ car.price }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.car-comparison {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-wrapper {
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.car-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
  margin-bottom: 16px;
}

.car-card {
  border: 1px solid #ddd;
  padding: 16px;
  width: 300px;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-grow: 1;
  max-width: calc(33.333% - 16px);
  transition: border-color 0.3s, opacity 0.3s;
}

.car-card.selected {
  border-color: var(--primary-yellow); 
  box-shadow: 0 0 10px rgba(242, 190, 0, 0.5);
}

.car-card.dimmed {
  opacity: 0.5;
  pointer-events: none;
}

.car-card h2 {
  margin-top: 0;
    color: var(--text-color); 
}

.car-card ul {
  list-style-type: none;
  padding: 0;
}

.car-card ul li {
  margin-bottom: 8px;
     color: var(--text-color);
}

.car-card button {
  margin-top: 16px;
}


.comparison {
  margin-top: 16px;
}

.comparison table {
  width: 100%;
  border-collapse: collapse;
}

.comparison th,
.comparison td {
  border: 1px solid #ddd;
  padding: 8px;
  color: white; 
}

.comparison th {
  background-color: #2c3e50; 
  text-align: center;
}


.comparison tr:nth-child(even) {
  background-color: #099999; 
}
.comparison tr:nth-child(odd) {
   background-color: #242424;
 }


.clickable-header {
  cursor: pointer;
}
.comparison tr:hover{
    background-color: #ddd;
}
</style>