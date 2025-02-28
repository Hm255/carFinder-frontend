<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetchCars } from '../services/api';
import type { Car } from '../services/api';

const cars = ref<Car[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const selectedCars = ref<Car[]>([]);

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
</script>

<template>
  <div class="car-comparison">
    <h1>Car Comparison</h1>

    <div v-if="loading">Loading cars...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
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
      <div v-if="selectedCars.length > 0" class="comparison">
        <h2>Car Comparison</h2>
        <table>
          <thead>
            <tr>
              <th>Specification</th>
              <th v-for="car in selectedCars" :key="car.registration_number">
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
                £{{ car.price }}
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
  transition: border-color 0.3s, opacity 0.3s;
}

.car-card.selected {
  border-color: #2196f3; /* Highlighted border color */
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
}

.car-card.dimmed {
  opacity: 0.5;
  pointer-events: none;
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

.comparison {
  margin-top: 32px;
}

.comparison table {
  width: 100%;
  border-collapse: collapse;
}

.comparison th,
.comparison td {
  border: 1px solid #ddd;
  padding: 8px;
}

.comparison th {
  background-color: #f2f2f2;
  text-align: center;
}

.comparison td {
  text-align: center;
}

.comparison tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
