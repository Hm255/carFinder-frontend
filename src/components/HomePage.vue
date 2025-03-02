<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { fetchCars, type Car } from '../services/api.ts';
import RandomCar from '../components/RandomCar.vue';
import { useRouter } from 'vue-router';

const searchQuery = ref('');
const randomCar = ref<Car | null>(null);
const cars = ref<Car[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
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

const filteredCars = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) {
    return cars.value;
  }

  return cars.value.filter(car => {
    return (
      car.make.toLowerCase().includes(query) ||
      car.model.toLowerCase().includes(query) ||
      car.color.toLowerCase().includes(query) ||
      car.fuel_type.toLowerCase().includes(query) ||
      car.registration_number.toLowerCase().includes(query)
    );
  });
});

const handleSearchKeyPress = (event: KeyboardEvent) => {
    if(event.key === 'Enter'){
        searchCars();
    }
}

const randomiseCar = () => {
    if (filteredCars.value.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredCars.value.length);
        randomCar.value = filteredCars.value[randomIndex];
    } else {
        randomCar.value = null;
    }
};

const searchCars = () => {
    if(searchQuery.value.trim() !== ''){
        router.push({
            path: '/cars',
            query: { search: searchQuery.value.trim()}
        });
    }
}

onMounted(loadCars);
</script>

<template>
  <div class="main-content">
    <h1>CarFinder</h1>

    <div class="search-group">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search for cars..."
        @keypress.enter="handleSearchKeyPress"
      />
        <button @click="searchCars">Search</button>
    </div>

    <div class="buttons">
      <button @click="() => router.push('/ComparisonPage')">Compare</button>
      <button @click="randomiseCar">Randomiser</button>
    </div>

    <div v-if="loading">Loading cars...</div>
    <div v-else-if="error">{{ error }}</div>
    <RandomCar v-if="randomCar" :car="randomCar" />
     <div v-if="!loading && filteredCars.length === 0 && searchQuery.trim() !== ''">
      No cars found matching your search.
    </div>
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
    color: var(--text-color);
}

/* NEW: Style for the search group */
.search-group {
  display: flex;        /* Use flexbox to keep input and button together */
  align-items: center;  /* Vertically align */
  gap: 1rem;           /* Space between input and button */
  margin-bottom: 2rem; /* Space *below* the search group */
  width: 60%;
  max-width: 800px;
}
/*style for search input*/
input[type="text"] {
  padding: 0.75rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
    flex: 1; /*add this so then search bar will take as much space as available*/
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

.main-content > div {
  width: 100%;
}
</style>