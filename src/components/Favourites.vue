<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Car } from '../services/api';
import { useRouter } from 'vue-router'; 

const favoriteCars = ref<Car[]>([]);
const router = useRouter(); 

onMounted(() => {
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) {
    favoriteCars.value = JSON.parse(storedFavorites);
  }
});

watch(favoriteCars, (newFavorites) => {
  localStorage.setItem('favorites', JSON.stringify(newFavorites));
}, { deep: true });

const removeFromFavorites = (carToRemove: Car) => {
  favoriteCars.value = favoriteCars.value.filter(car => car.registration_number !== carToRemove.registration_number);
};

const goToCarInfo = (registrationNumber: string) => {
  router.push({ name: 'CarInfo', params: { registrationNumber } });
};

</script>

<template>
  <div>
    <h1>Favorite Cars</h1>
    <div v-if="favoriteCars.length === 0">
      <p>You have no favorite cars yet.</p>
    </div>
    <div v-else>
      <div v-for="car in favoriteCars" :key="car.registration_number" class="car-card" @click="goToCarInfo(car.registration_number)">
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
          <button @click.stop="removeFromFavorites(car)">Remove from Favorites</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.car-card {
  border: 1px solid #ddd;
  padding: 16px;
  width: 300px;
  box-sizing: border-box;
  margin-bottom: 1rem;
  cursor: pointer; 
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

.main-content {
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
  gap: 1rem; 
  padding: 1rem;
  justify-items: center; 
  align-content: start; 

}
</style>