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
const isPlayerVisible = ref(false);

const showPlayer = () => {
  isPlayerVisible.value = true;
};

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
     <div class="video-wrapper">
    <div v-if="!isPlayerVisible" class="video-thumbnail" @click="showPlayer">
      <img
        :src="`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`"
        :alt="'YouTube video thumbnail'"
      />
      <div class="play-button"></div>
    </div>
    <iframe
      v-else
      width="560"
      height="315"
      :src="`https://www.youtube.com/embed/${videoId}?autoplay=1`"
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
  max-width: 560px;
  margin: 1rem auto;
  padding-bottom: 56.25%; 
  height: 0;
}

.video-container iframe,
.video-thumbnail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 68px;
  height: 48px;
  background: url('https://www.gstatic.com/images/icons/material/system/1x/play_arrow_white_48dp.png') no-repeat center center;
  background-size: contain;
  opacity: 0.85;
  transition: opacity 0.3s ease;
}

.play-button:hover {
  opacity: 1;
}
</style>
