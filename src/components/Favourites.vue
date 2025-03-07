<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Car } from '../services/api';
import { useRouter } from 'vue-router';

const favouriteCars = ref<Car[]>([]);
const selectedCars = ref<boolean[]>([]); 
const router = useRouter();


onMounted(() => {
  const storedFavourites = localStorage.getItem('favourites');
  if (storedFavourites) {
    const cars = JSON.parse(storedFavourites);
    favouriteCars.value = cars;
    selectedCars.value = new Array(cars.length).fill(false);
  }
});


watch(favouriteCars, (newFavourites) => {
  localStorage.setItem('favourites', JSON.stringify(newFavourites));

  selectedCars.value = selectedCars.value.slice(0, newFavourites.length);
  if (newFavourites.length > selectedCars.value.length) {
    selectedCars.value.push(...new Array(newFavourites.length - selectedCars.value.length).fill(false));
  }
}, { deep: true });


const removeFromFavourites = (carToRemove: Car) => {
  const indexToRemove = favouriteCars.value.findIndex(
    car => car.registration_number === carToRemove.registration_number
  );
  if (indexToRemove !== -1) {
    favouriteCars.value.splice(indexToRemove, 1);
    selectedCars.value.splice(indexToRemove, 1);
  }
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
    car.wheel_plan
  ].map(value => `"${value}"`).join(',');
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
Price: £${car.price}`.trim();
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


const exportSelectedCarsAsCSV = () => {
 const carsToExport = favouriteCars.value.filter((_, index) => selectedCars.value[index]);
    if(carsToExport.length === 0) return;
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
 const selectedCarsData = carsToExport.map(generateCarCSVRow).join('\n');
 downloadData(header + '\n' + selectedCarsData, 'selected_favourite_cars.csv');
};

const exportSelectedCarsAsTXT = () => {
 const carsToExport = favouriteCars.value.filter((_, index) => selectedCars.value[index]);
    if(carsToExport.length === 0) return;
 const selectedCarsData = carsToExport.map(generateCarData).join('\n\n');
 downloadData(selectedCarsData, 'selected_favourite_cars.txt');
};

const exportSelectedCarsAsJSON = () => {
 const carsToExport = favouriteCars.value.filter((_, index) => selectedCars.value[index]);
    if(carsToExport.length === 0) return;
 const selectedCarsData = carsToExport.map(car => ({
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
 downloadData(JSON.stringify(selectedCarsData, null, 2), 'selected_favourite_cars.json');
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

const exportAllCarsAsTXT = () => {
  const allCarsData = favouriteCars.value.map(car => generateCarData(car)).join('\n\n');
  downloadData(allCarsData, 'favourite_cars.txt');
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


const exportCar = (car: Car) => {
  const carData = generateCarData(car);
  downloadData(carData, `favourite_car.txt`);
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
</script>

<template>
  <div>
    <h1>Favourite Cars</h1>
    <div v-if="favouriteCars.length === 0">
      <p>You have no favourite cars yet.</p>
    </div>
    <div v-else>
     
      <div class="export-buttons">
        <button @click="exportAllCarsAsTXT">Export All Cars (.txt)</button>
        <button @click="exportAllCarsAsJSON">Export All Cars (.JSON)</button>
        <button @click="exportAllCarsAsCSV">Export All Cars (.CSV)</button>
      </div>

      <div class="export-buttons">
        <button @click="exportSelectedCarsAsTXT">Export Selected Cars (.txt)</button>
        <button @click="exportSelectedCarsAsJSON">Export Selected Cars (.JSON)</button>
        <button @click="exportSelectedCarsAsCSV">Export Selected Cars (.CSV)</button>
      </div>

      <div v-for="(car, index) in favouriteCars" :key="car.registration_number" class="car-card" :class="{ selected: selectedCars[index] }">
        <input type="checkbox" v-model="selectedCars[index]" />

        <div class="car-details">
          <h2 @click="goToCarInfo(car.registration_number)">
            {{ car.make }} {{ car.model }}
          </h2>
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
        </div>
        <div class="buttons">
          <button @click.stop="removeFromFavourites(car)">Remove from favourites</button>
          <button @click.stop="exportCar(car)">Export Car (.txt)</button>
          <button @click.stop="exportCarAsJSON(car)">Export Car (.JSON)</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.export-buttons {
  margin-bottom: 1rem;
}

.car-card {
  border: 1px solid #ddd;
  padding: 16px;
  margin-bottom: 1rem;
  width: 300px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}


.car-card.selected {
  border-color: var(--primary-yellow); 
  box-shadow: 0 0 10px rgba(242, 190, 0, 0.5);
}

.car-details h2 {
  margin: 0;
  cursor: pointer;
}

.car-details ul {
  list-style-type: none;
  padding: 0;
}

.car-details ul li {
  margin-bottom: 8px;
}

.buttons > button {
  margin-right: 5px;
  padding: 8px 12px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;
}

.buttons > button:hover {
  background-color: #e0e0e0;
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
