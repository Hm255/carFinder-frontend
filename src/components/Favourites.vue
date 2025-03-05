<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Car } from '../services/api';
import { useRouter } from 'vue-router';

const favouriteCars = ref<Car[]>([]);
const selectedCars = ref<boolean>();
const router = useRouter();

onMounted(() => {
  const storedfavourites = localStorage.getItem('favourites');
  if (storedfavourites) {
    favouriteCars.value = JSON.parse(storedfavourites);
  }
});

watch(favouriteCars, (newfavourites) => {
  localStorage.setItem('favourites', JSON.stringify(newfavourites));
}, { deep: true });

const removeFromfavourites = (carToRemove: Car) => {
  favouriteCars.value = favouriteCars.value.filter(car => car.registration_number !== carToRemove.registration_number);
};

const goToCarInfo = (registrationNumber: string) => {
  router.push({ name: 'CarInfo', params: { registrationNumber } });
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A'; 
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const generateCarCSVRow = (car: Car): string => {
  return [
    car.registration_number,
    car.make,
    car.model,
    car.color,
    car.engine_size,
    car.year_of_manufacture,
    formatDate(car.date_of_manufacture),
    car.co2_emissions,
    formatDate(car.tax_due_date),
    formatDate(car.date_of_last_v5c_issued),
    formatDate(car.first_used_date),
    car.marked_for_export ? 'Yes' : 'No',
    car.has_outstanding_recall ? 'Yes' : 'No',
    car.type_approval,
    car.power_output,
    car.tax_status,
    car.price,
    car.fuel_type,
    car.wheel_plan,
  ].map(value => `"${value}"`).join(',');
};



const exportAllCarsAsCSV = () => {
  const header = [
    'Registration Number', 
    'Make', 
    'Model', 
    'Color', 
    'Engine Size', 
    'Year of Manufacture',
    'Date of Manufacture', 
    'CO2 Emissions',
    'Tax Due Date',
    'Date of Last V5C Issued',
    'First Used Date',
    'Marked for Export',
    'Outstanding Recall',
    'Type Approval',   
    'Power Output',
    'Tax Status', 
    'Price', 
    'Fuel Type', 
    'Wheel Plan'
  ].join(',');
  const allCarsData = favouriteCars.value.map(generateCarCSVRow).join('\n');
  downloadData(header + '\n' + allCarsData, 'favourite_cars.csv');
};

const generateCarData = (car: Car): string => {
  return `
    Make: ${car.make}
    Model: ${car.model}
    Color: ${car.color}
    Engine Size: ${car.engine_size} cc
    Year of Manufacture: ${car.year_of_manufacture}
    CO₂ Emissions: ${car.co2_emissions} g/km
    Fuel Type: ${car.fuel_type}
    Wheel Plan: ${car.wheel_plan}
    Power Output: ${car.power_output} HP 
    Price: £${car.price}
  `;
};

const exportCar = (car: Car) => {
  const carData = generateCarData(car);
  downloadData(carData, `favourite_car.txt`);
};

const exportAllCars = () => {
  const allCarsData = favouriteCars.value.map(car => generateCarData(car)).join('\n\n');
  downloadData(allCarsData, 'favourite_cars.txt');
};

const exportCarAsJSON = (car: Car) => {
  const carData = {
    "Registration Number": car.registration_number,
    "Make": car.make,
    "Model": car.model,
    "Color": car.color,
    "Engine Size": car.engine_size,
    "Year of Manufacture": car.year_of_manufacture,
    "Date of Manufacture": formatDate(car.date_of_manufacture),
    "CO2 Emissions": car.co2_emissions,
    "Tax Due Date": formatDate(car.tax_due_date),
    "Date of Last V5C Issued": formatDate(car.date_of_last_v5c_issued),
    "First Used Date": formatDate(car.first_used_date),
    "Marked for Export": car.marked_for_export ? 'Yes' : 'No',
    "Outstanding Recall": car.has_outstanding_recall ? 'Yes' : 'No',
    "Type Approval": car.type_approval,
    "Power Output": car.power_output,
    "Tax Status": car.tax_status,
    "Price": car.price,
    "Fuel Type": car.fuel_type,
    "Wheel Plan": car.wheel_plan
  };

  downloadData(JSON.stringify(carData, null, 2), `favourite_car.json`); 
};

const exportAllCarsAsJSON = () => {
  const allCarsData = favouriteCars.value.map(car => ({
    "Registration Number": car.registration_number,
    "Make": car.make,
    "Model": car.model,
    "Color": car.color,
    "Engine Size": car.engine_size,
    "Year of Manufacture": car.year_of_manufacture,
    "Date of Manufacture": formatDate(car.date_of_manufacture),
    "CO2 Emissions": car.co2_emissions,
    "Tax Due Date": formatDate(car.tax_due_date),
    "Date of Last V5C Issued": formatDate(car.date_of_last_v5c_issued),
    "First Used Date": formatDate(car.first_used_date),
    "Marked for Export": car.marked_for_export ? 'Yes' : 'No',
    "Outstanding Recall": car.has_outstanding_recall ? 'Yes' : 'No',
    "Type Approval": car.type_approval,
    "Power Output": car.power_output,
    "Tax Status": car.tax_status,
    "Price": car.price,
    "Fuel Type": car.fuel_type,
    "Wheel Plan": car.wheel_plan
  }));

  downloadData(JSON.stringify(allCarsData, null, 2), 'favourite_cars.json');
};

const downloadData = (data: string, filename: string) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
</script>

<template>
  <div>
    <h1>favourite Cars</h1>
    <div v-if="favouriteCars.length === 0">
      <p>You have no favourite cars yet.</p>
    </div>
    <div v-else>
      <button @click="exportSelectedCars">Export Selected Cars</button>
      <button @click="exportAllCars">Export All Cars (.txt)</button>
      <button @click="exportAllCarsAsJSON">Export All Cars (.JSON)</button>
      <button @click="exportAllCarsAsCSV">Export All Cars (.CSV)</button>

      <div v-for="car in favouriteCars" :key="car.registration_number" class="car-card" @click="goToCarInfo(car.registration_number)">
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
        <button @click.stop="removeFromfavourites(car)">Remove from favourites</button>
        <button @click.stop="exportCar(car)">Export Car (.txt)</button>
        <button @click.stop="exportCarAsJSON(car)">Export Car (.JSON)</button>
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

.car-card button {
  margin-top: 10px; 
  margin-right: 5px; 
  padding: 8px 12px; 
  background-color: #f0f0f0; 
  border: 1px solid #ccc; 
  cursor: pointer;
}

.car-card button:hover {
  background-color: #e0e0e0; 
}

.main-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
  justify-items: center;
  align-content: start;
}


button {
  margin-bottom: 10px; 
  padding: 8px 12px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #e0e0e0;
}
</style>