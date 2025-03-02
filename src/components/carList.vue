<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { fetchCars, type Car } from '../services/api.ts'
import { useRouter, useRoute } from 'vue-router';

interface SortOption {
  field: keyof Car | null;
  order: 'asc' | 'desc';
}

const cars = ref<Car[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const sortOption = ref<SortOption>({ field: null, order: 'asc' });
const fuelTypeFilter = ref<string | null>(null);
const favoriteCars = ref<Car[]>([]);
const router = useRouter();
const route = useRoute();

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

const sortCars = (field: keyof Car) => {
  if (sortOption.value.field === field) {
    sortOption.value.order = sortOption.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    sortOption.value.field = field;
    sortOption.value.order = 'asc';
  }
};

const searchQuery = computed(() => {
  return route.query.search as string || '';
});

// No longer needed: watch(searchQuery, ...);  Keep the fuel filter!

const filteredCars = computed(() => {
  let filtered = cars.value;

  // 1. Apply fuel filter (if present)
  if (fuelTypeFilter.value) {
    filtered = filtered.filter(car => car.fuel_type.toLowerCase() === fuelTypeFilter.value!.toLowerCase());
  }

  // 2. Apply search filter (if present)
  const query = searchQuery.value.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(car => {
      return (
        car.make.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.color.toLowerCase().includes(query) ||
        car.fuel_type.toLowerCase().includes(query) || // Search fuel type again
        car.registration_number.toLowerCase().includes(query)
      );
    });
  }

  return filtered; // Return the *combined* result
});



const sortedCars = computed(() => {
  let carsToSort = filteredCars.value;

  if (!sortOption.value.field) {
    return carsToSort;
  }

  const { field, order } = sortOption.value;
  if (!field) {
    return carsToSort;
  }

  return [...carsToSort].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });
});

onMounted(() => {
  loadCars();
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) {
    favoriteCars.value = JSON.parse(storedFavorites);
  }
});

watch(favoriteCars, (newFavorites) => {
  localStorage.setItem('favorites', JSON.stringify(newFavorites));
}, { deep: true });

const toggleFavorite = (car: Car) => {
  const index = favoriteCars.value.findIndex(favCar => favCar.registration_number === car.registration_number);
  if (index === -1) {
    favoriteCars.value.push(car);
  } else {
    favoriteCars.value.splice(index, 1);
  }
};

const isFavorite = (car: Car) => {
  return favoriteCars.value.some(favCar => favCar.registration_number === car.registration_number)
}

const goToCarDetails = (car: Car) => {
  router.push({ name: 'CarInfo', params: { registrationNumber: car.registration_number } });
};

</script>

<template>
  <div>
    <h1>Car List</h1>

    <div>
      <label id="fuel-filter-label" for="fuel-type-select">Filter by Fuel Type: </label>
      <select id="fuel-type-select" v-model="fuelTypeFilter">
        <option value="">All</option>
        <option value="petrol">Petrol</option>
        <option value="diesel">Diesel</option>
        <option value="electricity">Electric</option>
      </select>
    </div>

    <div v-if="loading">Loading cars...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>Car Name</th>
            <th>Color</th>
            <th>
              <div class="sort-header">
                Engine Size
                <select @change="sortCars('engine_size')">
                  <option value="" disabled selected>Sort</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </th>
            <th>
              <div class="sort-header">
                Year of Manufacture
                <select @change="sortCars('year_of_manufacture')">
                  <option value="" disabled selected>Sort</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </th>
            <th>
              <div class="sort-header">
                CO₂ Emissions
                <select @change="sortCars('co2_emissions')">
                  <option value="" disabled selected>Sort</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </th>
            <th>Fuel Type</th>
            <th>Wheel Plan</th>
            <th>
              <div class="sort-header">
                Power Output
                <select @change="sortCars('power_output')">
                  <option value="" disabled selected>Sort</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </th>
            <th>
              <div class="sort-header">
                Price
                <select @change="sortCars('price')">
                  <option value="" disabled selected>Sort</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </th>
            <th>Add to Favourites</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="car in sortedCars" :key="car.registration_number" @click="goToCarDetails(car)" class="clickable-row">
            <td>{{ car.make }} {{ car.model }}</td>
            <td>{{ car.color }}</td>
            <td>{{ car.engine_size }} cc</td>
            <td>{{ car.year_of_manufacture }}</td>
            <td>{{ car.co2_emissions }} g/km</td>
            <td>{{ car.fuel_type }}</td>
            <td>{{ car.wheel_plan }}</td>
            <td>{{ car.power_output }} HP</td>
            <td>£{{ car.price }}</td>
            <td class="button-cell">
              <button @click.stop="toggleFavorite(car)" class="favorite-button">
                {{ isFavorite(car) ? 'Remove from Favorites' : 'Add to Favorites' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && sortedCars.length === 0">
        No cars found.
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ... (Your existing styles - no changes needed here) ... */

.table-container {
  overflow-x: auto;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  table-layout: auto;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  white-space: nowrap;
  color: white; /* White text */
}

th {
  background-color: #2c3e50; /* Darker background for header */
  text-align: left;
}
/* Target the rows you want to be yellow/gold */
tr:nth-child(even) {
    background-color: #099999;
}
tr:nth-child(odd) {
    background-color: #242424;
}


h1 {
  margin-bottom: 16px;
    color: var(--text-color);
}

.sort-header {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.sort-header select{
  margin-left: 5px;
}

.button-cell {
    width: 180px;
}
.favorite-button{
    width: 100%;
}

/* Make the rows clickable */
.clickable-row {
  cursor: pointer;
}
.clickable-row:hover{
    background-color: #ddd;
}
</style>