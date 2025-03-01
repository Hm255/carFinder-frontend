<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { fetchCars, type Car } from '../services/api.ts'

interface SortOption {
  field: keyof Car | null;
  order: 'asc' | 'desc';
}

const cars = ref<Car[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const sortOption = ref<SortOption>({ field: null, order: 'asc' });
const fuelTypeFilter = ref<string | null>(null);
const favoriteCars = ref<Car[]>([]); // Store favorite cars


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

const filteredCars = computed(() => {
  if (!fuelTypeFilter.value) {
    return cars.value;
  }
  return cars.value.filter(car => car.fuel_type.toLowerCase() === fuelTypeFilter.value!.toLowerCase());
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

// Load favorites from localStorage
onMounted(() => {
  loadCars();
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) {
    favoriteCars.value = JSON.parse(storedFavorites);
  }
});

// Watch for changes and save to localStorage
watch(favoriteCars, (newFavorites) => {
  localStorage.setItem('favorites', JSON.stringify(newFavorites));
}, { deep: true });

const toggleFavorite = (car: Car) => {
  const index = favoriteCars.value.findIndex(favCar => favCar.registration_number === car.registration_number);
  if (index === -1) {
    favoriteCars.value.push(car); // Add to favorites
  } else {
    favoriteCars.value.splice(index, 1); // Remove from favorites
  }
};

const isFavorite = (car: Car) => {
    return favoriteCars.value.some(favCar => favCar.registration_number === car.registration_number)
}
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
        <option value="electric">Electric</option>
      </select>
    </div>

    <div v-if="loading">Loading cars...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="table-container">  <table>
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
          <tr v-for="car in sortedCars" :key="car.registration_number">
            <td>{{ car.make }} {{ car.model }}</td>
            <td>{{ car.color }}</td>
            <td>{{ car.engine_size }} cc</td>
            <td>{{ car.year_of_manufacture }}</td>
            <td>{{ car.co2_emissions }} g/km</td>
            <td>{{ car.fuel_type }}</td>
            <td>{{ car.wheel_plan }}</td>
            <td>{{ car.power_output }} HP</td>
            <td>£{{ car.price }}</td>
             <td class = "button-cell">
            <button @click="toggleFavorite(car)" class = "favorite-button">
              {{ isFavorite(car) ? 'Remove from Favorites' : 'Add to Favorites' }}
            </button>
          </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

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
}

th {
  background-color: #f2f2f2;
  text-align: left;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #e9e9e9;
}

h1 {
  margin-bottom: 16px;
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
</style>