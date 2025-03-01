<script setup lang="ts">
import { ref } from 'vue';
import { fetchCars, type Car } from '../services/api.ts'; 
import RandomCar from '../components/RandomCar.vue';

const searchQuery = ref('');
const randomCar = ref<Car | null>(null); 
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


const randomiseCar = () => {
    if (cars.value.length > 0) {
        const randomIndex = Math.floor(Math.random() * cars.value.length);
        randomCar.value = cars.value[randomIndex];
    } else{
        randomCar.value = null; 
    }

};


loadCars();
</script>

<template>
  <div class="main-content">
    <h1>CarFinder</h1>
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for cars..."
    />
    <div class="buttons">
      <button><a class="Link" href="/ComparisonPage">Compare</a></button>
      <button @click="randomiseCar">Randomiser</button>
    </div>

     <div v-if="loading">Loading cars...</div>
      <div v-else-if="error">{{ error }}</div>
    <RandomCar v-if="randomCar" :car="randomCar" />
  </div>
</template>


<style scoped>

.main-content {

  padding: 2rem;
  text-align: center;
  flex: 1;
  max-width: 100%; 
  margin: 0 auto;  
    width: 100%; 
}

h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

input[type="text"] {
  padding: 0.75rem;
  font-size: 1.2rem;
  width: 60%;
  border: none;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #F2BE00;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e0ac00;
}

.Link {
text-decoration: none;
color: inherit;

}

.Link:hover {
text-decoration: underline;
color: blue;
}

.buttons{
  padding-bottom: 40px;
}
</style>