<script setup lang="ts">
import { toRefs } from 'vue';
import type { Car } from '../services/api';

const props = defineProps<{
  car: Car;
}>();

const { car } = toRefs(props);
</script>

<template>
  <router-link :to="{ name: 'CarInfo', params: { registrationNumber: car.registration_number } }" class="car-card">
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
  </router-link>
</template>

<style scoped>
.car-card {
  border: 1px solid #ddd;
  padding: 16px;
  width: 300px;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-grow: 1;
  max-width: calc(33.333% - 16px);
  transition: border-color 0.3s, opacity 0.3s;
    display: block; /* Important: Make router-link a block-level element */
  text-decoration: none; /* Remove default link underline */
  color: inherit; /* Inherit text color */
}

.car-card.selected {
  border-color: var(--primary-yellow); /* Use CSS variable */
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
  list-style: none;
  padding: 0;
}

.car-card ul li {
  margin-bottom: 8px;
   color: var(--text-color);
}

.car-card button {
  margin-top: 16px;
}

/* Style for the active car card (optional) */
.router-link-active {
  border-color: var(--primary-yellow);
  box-shadow: 0 0 10px rgba(242, 190, 0, 0.5);
}
</style>