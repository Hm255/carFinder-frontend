<script setup lang="ts">
import type { Car } from '../services/api';

defineProps<{
  car: Car;
}>();
</script>

<template>
  <div class="car-card">
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
  </div>
</template>

<style scoped>

.car-card {
  border: 1px solid #ddd;
  padding: 16px;
  width: 300px; 
  box-sizing: border-box;
  margin: 0 auto;
  margin-bottom: 1rem;
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
</style>