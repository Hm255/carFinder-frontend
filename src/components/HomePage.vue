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

const videoId = 'WgWzd60XmUY';
const showVideo = ref(false);

const loadCars = async () => {
  try {
    const result = await fetchCars();
    cars.value = Array.isArray(result) ? result : [];
  } catch (err: any) {
    error.value = 'Failed to load cars.';
  } finally {
    loading.value = false;
  }
};

const filteredCars = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return cars.value;
  return cars.value.filter(car =>
    car.make.toLowerCase().includes(query) ||
    car.model.toLowerCase().includes(query) ||
    car.color.toLowerCase().includes(query) ||
    car.fuel_type.toLowerCase().includes(query) ||
    car.registration_number.toLowerCase().includes(query)
  );
});

const handleSearchKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') searchCars();
};

const randomiseCar = () => {
  if (filteredCars.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredCars.value.length);
    randomCar.value = filteredCars.value[randomIndex] ?? null;
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

const showNewAndAffordable = () => {
  router.push({ path: '/cars', query: { filter: 'affordable' } });
};

const showNewAndLuxury = () => {
  router.push({ path: '/cars', query: { filter: 'luxury' } });
};

onMounted(() => {
  loadCars();
  setTimeout(() => {
    showVideo.value = true;
  }, 800); 
});
</script>

<template>
  <div class="main-content">
    <h1>CarFinder</h1>

    <div class="search-group">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search for cars..."
        @keyup.enter="handleSearchKeyPress"
      />
      <button @click="searchCars">Search</button>
    </div>

    <div v-if="searchQuery.trim() !== '' && !loading">
      <span v-if="filteredCars.length > 0">
        {{ filteredCars.length }} match{{ filteredCars.length > 1 ? 'es' : '' }} found
      </span>
      <span v-else>No matches found</span>
    </div>

    <div class="buttons">
      <button @click="() => router.push('/ComparisonPage')">Compare</button>
      <button @click="randomiseCar">Randomiser</button>
    </div>

    <div class="filter-buttons">
      <button @click="showNewAndAffordable">New &amp; Affordable</button>
      <button @click="showNewAndLuxury">Luxury</button>
    </div>

    <div v-if="loading">Loading cars...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-if="searchQuery.length === 0">
      Type before pressing search
    </div>

    
    <div class="video-container" v-if="showVideo">
      <iframe
        :src="`https://www.youtube.com/embed/${videoId}`"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
      ></iframe>
    </div>

    <div v-if="!loading && filteredCars.length === 0 && searchQuery.trim() !== ''">
      No cars found matching your search.
    </div>

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


.video-container {
  position: relative;
  width: 100%;
  max-width: auto;
  margin: 1rem auto;
  padding-bottom: 56.25%; 
  height: 0;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

