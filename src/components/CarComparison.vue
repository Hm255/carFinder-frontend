<template>
    <div v-if="comparisonList.length > 0" class="comparison">
      <h2>Car Comparison</h2>
      <table>
        <thead>
          <tr>
            <th>Specification</th>
            <th v-for="car in comparisonList" :key="car.registration_number">
              {{ car.make }} {{ car.model }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Color</td>
            <td v-for="car in comparisonList" :key="car.registration_number + '-color'">
              {{ car.color }}
            </td>
          </tr>
          <tr>
            <td>Engine Size</td>
            <td v-for="car in comparisonList" :key="car.registration_number + '-engine'">
              {{ car.engine_size }} cc
            </td>
          </tr>
          <tr>
            <td>Year of Manufacture</td>
            <td v-for="car in comparisonList" :key="car.registration_number + '-year'">
              {{ car.year_of_manufacture }}
            </td>
          </tr>
          <tr>
            <td>CO₂ Emissions</td>
            <td v-for="car in comparisonList" :key="car.registration_number + '-co2'">
              {{ car.co2_emissions }} g/km
            </td>
          </tr>
          <tr>
            <td>Fuel Type</td>
            <td v-for="car in comparisonList" :key="car.registration_number + '-fuel'">
              {{ car.fuel_type }}
            </td>
          </tr>
          <tr>
            <td>Wheel Plan</td>
            <td v-for="car in comparisonList" :key="car.registration_number + '-wheel'">
              {{ car.wheel_plan }}
            </td>
          </tr>
          <tr>
            <td>Power Output</td>
            <td v-for="car in comparisonList" :key="car.registration_number + '-power'">
              {{ car.power_output }} HP
            </td>
          </tr>
          <tr>
            <td>Price</td>
            <td v-for="car in comparisonList" :key="car.registration_number + '-price'">
              £{{ car.price }}
            </td>
          </tr>
          <!-- Add more specifications as needed -->
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  import type { Car } from '../services/api';
  
  const props = defineProps<{
    comparisonList: Car[];
  }>();
  </script>
  
  <style scoped>
  .comparison {
    margin-top: 32px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
    text-align: center;
  }
  
  td {
    text-align: center;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  </style>
  