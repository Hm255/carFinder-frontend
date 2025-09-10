<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { fetchCars, type Car } from '../services/api.ts';
import { useRouter, useRoute } from 'vue-router';

interface SortOption {
  field: keyof Car | null;
  order: 'asc' | 'desc';
}

const wheelPlans = [
  { wheel_plan_id: 1, wheel_plan_name: '2 WHEEL' },
  { wheel_plan_id: 2, wheel_plan_name: '3 WHEEL' },
  { wheel_plan_id: 3, wheel_plan_name: '2 AXLE RIGID BODY' },
  { wheel_plan_id: 4, wheel_plan_name: '3 AXLE RIGID BODY' },
  { wheel_plan_id: 5, wheel_plan_name: '4 AXLE RIGID BODY' },
  { wheel_plan_id: 6, wheel_plan_name: '2 AXLE ARTICULATED' },
  { wheel_plan_id: 7, wheel_plan_name: '3 AXLE ARTICULATED' },
  { wheel_plan_id: 8, wheel_plan_name: '4 AXLE ARTICULATED' },
  { wheel_plan_id: 9, wheel_plan_name: '3 WHEEL DRIVE' },
  { wheel_plan_id: 10, wheel_plan_name: '4 WHEEL DRIVE' },
  { wheel_plan_id: 11, wheel_plan_name: 'ALL WHEEL DRIVE' },
  { wheel_plan_id: 12, wheel_plan_name: '6 WHEEL' },
  { wheel_plan_id: 13, wheel_plan_name: '6 WHEEL DRAWBAR' },
  { wheel_plan_id: 14, wheel_plan_name: '8 WHEEL RIGID BODY' },
  { wheel_plan_id: 15, wheel_plan_name: 'LEFT-HAND DRIVE' },
  { wheel_plan_id: 16, wheel_plan_name: 'QUADRICYCLE' },
  { wheel_plan_id: 17, wheel_plan_name: 'TRAILER' },
  { wheel_plan_id: 18, wheel_plan_name: 'SEMI-TRAILER' },
  { wheel_plan_id: 19, wheel_plan_name: 'TRACTOR UNIT' },
  { wheel_plan_id: 20, wheel_plan_name: 'OTHER' }
];

const cars = ref<Car[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const sortOption = ref<SortOption>({ field: null, order: 'asc' });
const fuelTypeFilter = ref<string | null>(null);
const wheelPlanFilter = ref<string | null>(null);
const favouriteCars = ref<Car[]>([]);
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
  return (route.query.search as string) || '';
});

watch(searchQuery, () => {
  fuelTypeFilter.value = null;
  wheelPlanFilter.value = null;
});

const filteredCars = computed(() => {
  let filtered = cars.value;
  if (fuelTypeFilter.value) {
    filtered = filtered.filter(car =>
      car.fuel_type.toLowerCase() === fuelTypeFilter.value!.toLowerCase()
    );
  }

  if (wheelPlanFilter.value) {
    filtered = filtered.filter(car => car.wheel_plan === wheelPlanFilter.value);
  }
  const query = searchQuery.value.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(car => {
      return (
        car.make.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.color.toLowerCase().includes(query) ||
        car.fuel_type.toLowerCase().includes(query) ||
        car.registration_number.toLowerCase().includes(query)
      );
    });
  }


  const filterQuery = route.query.filter as string | undefined;
  if (filterQuery === 'affordable') {
    filtered = filtered.filter(car => car.price <= 20000);
    return [...filtered].sort((a, b) => {
      if (a.year_of_manufacture !== b.year_of_manufacture) {
        return b.year_of_manufacture - a.year_of_manufacture;
      }
      return a.price - b.price;
    });
  } else if (filterQuery === 'luxury') {
    
    return [...filtered].sort((a, b) => {
      if (a.year_of_manufacture !== b.year_of_manufacture) {
        return b.year_of_manufacture - a.year_of_manufacture;
      }
      return b.price - a.price;
    });
  }
  return filtered;
});

const sortedCars = computed(() => {
  let carsToSort = filteredCars.value;
  if (!sortOption.value.field) {
    return carsToSort;
  }
  const { field, order } = sortOption.value;
  return [...carsToSort].sort((a, b) => {
    const aVal = a[field] as number;
    const bVal = b[field] as number;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });
});

onMounted(() => {
  console.log('mounted')
  loadCars();
  const storedFavourites = localStorage.getItem('favourites');
  if (storedFavourites) {
    favouriteCars.value = JSON.parse(storedFavourites);
  }
});

watch(favouriteCars, (newFavourites) => {
  localStorage.setItem('favourites', JSON.stringify(newFavourites));
}, { deep: true });

const togglefavourite = (car: Car) => {
  const index = favouriteCars.value.findIndex(favCar => favCar.registration_number === car.registration_number);
  if (index === -1) {
    favouriteCars.value.push(car);
  } else {
    favouriteCars.value.splice(index, 1);
  }
};

const isfavourite = (car: Car) => {
  return favouriteCars.value.some(favCar => favCar.registration_number === car.registration_number);
};

const goToCarDetails = (car: Car) => {
  router.push({ name: 'CarInfo', params: { registrationNumber: car.registration_number } });
};
</script>

<template>
  <div>
    <h1>Car List</h1>

    <div class="filter-container">
      <label for="fuel-type-select">Filter by Fuel Type: </label>
      <select id="fuel-type-select" v-model="fuelTypeFilter">
        <option value="">All</option>
        <option value="petrol">Petrol</option>
        <option value="diesel">Diesel</option>
        <option value="electricity">Electric</option>
        <option value="hybrid">Hybrid</option>
      </select>

      <label for="wheel-plan-select">Filter by Wheel Plan: </label>
      <select id="wheel-plan-select" v-model="wheelPlanFilter">
        <option value="">All</option>
        <option v-for="plan in wheelPlans" :key="plan.wheel_plan_id" :value="plan.wheel_plan_name">
          {{ plan.wheel_plan_name }}
        </option>
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
                <select @change="sortCars('engine_size')" >
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
              <button @click.stop="togglefavourite(car)" class="favourite-button">
                {{ isfavourite(car) ? 'Remove from favourites' : 'Add to favourites' }}
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
  color: white;
}

th {
  background-color: #2c3e50;
  text-align: left;
}

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
.favourite-button{
    width: 100%;
}

.clickable-row {
  cursor: pointer;
}
.clickable-row:hover{
    background-color: #ddd;
}

.filter-container{
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
}

#fuel-filter-label, #wheel-plan-label{
    color: var(--text-color);
}
</style>
