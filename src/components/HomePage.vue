<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { fetchCars, type Car } from '../services/api';
import RandomCar from '../components/RandomCar.vue';
import { useRouter } from 'vue-router';

const searchQuery = ref('');
const randomCar = ref<Car | null>(null);
const cars = ref<Car[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const router = useRouter();
const activeFilter = ref<string | null>(null);

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
  if (event.key === 'Enter') {
    searchCars();
  }
};

const randomiseCar = () => {
  if (filteredCars.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredCars.value.length);
    randomCar.value = filteredCars.value[randomIndex];
  } else {
    randomCar.value = null;
  }
};

const searchCars = () => {
  if (searchQuery.value.trim() !== '') {
    router.push({
      path: '/cars',
      query: { search: searchQuery.value.trim() }
    });
  }
};

/*
  newAndAffordableCars:
  • Returns only those cars whose price is less than or equal to £20,000.
  • Orders them first by year_of_manufacture in descending order (newest first)
    and then, within the same year, orders them in ascending order by price.
*/
const newAndAffordableCars = computed(() => {
  if (!cars.value.length) return [];
  return cars.value
    .filter(car => car.price <= 20000)
    .sort((a, b) => {
      if (a.year_of_manufacture !== b.year_of_manufacture) {
        return b.year_of_manufacture - a.year_of_manufacture;
      }
      return a.price - b.price;
    });
});
console.log(newAndAffordableCars);

const LuxuryCars = computed(() => {
  if (!cars.value.length) return [];
  return [...cars.value].sort((a, b) => {
    if (a.year_of_manufacture !== b.year_of_manufacture) {
      return b.year_of_manufacture - a.year_of_manufacture;
    }
    return b.price - a.price;
  });
});
console.log(LuxuryCars);

const showNewAndAffordable = () => {
  activeFilter.value = 'affordable';
  router.push({ path: '/cars', query: { filter: 'affordable' } });
};

const showNewAndLuxury = () => {
  activeFilter.value = 'luxury';
  router.push({ path: '/cars', query: { filter: 'luxury' } });
};

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

    <div class="filter-buttons">
      <button @click="showNewAndAffordable" :class="{ active: activeFilter === 'affordable' }">
        New &amp; Affordable
      </button>
      <button @click="showNewAndLuxury" :class="{ active: activeFilter === 'luxury' }">
        Luxury
      </button>
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

.search-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 60%;
  max-width: 800px;
}

input[type="text"] {
  padding: 0.75rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  flex: 1;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
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

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.active {
  background-color: #e0ac00;
}

.main-content > div {
  width: 100%;
}
</style>
