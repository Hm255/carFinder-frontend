<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchCars, type Car } from '../services/api';

const car = ref<Car | null>(null);
const loading = ref(true);
const error = ref<string | null>(null); // Keep for other errors
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    const registrationNumber = route.params.registrationNumber as string;
    if (!registrationNumber) {
      // Redirect to 404 if no registration number
      router.push({ name: 'NotFound' });
      return; // Stop execution here
    }

    const allCars = await fetchCars();
    const foundCar = allCars.find(c => c.registration_number === registrationNumber);

    if (foundCar) {
      car.value = foundCar;
    } else {
      // Redirect to 404 if car not found
      router.push({ name: 'NotFound' });
      return; // Stop execution
    }
  } catch (err: any) {
    error.value = 'Failed to load car details.'; // Keep for other errors
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
});

const goToPayment = () => {
  if (car.value) {
    router.push({ name: 'Payment', params: { registrationNumber: car.value.registration_number } });
  }
};

const formatDate = (dateString: string): string => {
    if (!dateString) {
        return 'N/A';
    }
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
          }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return 'Invalid Date';
    }
};
</script>

<template>
  <div class="car-info">
    <h1>Car Details</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="car">
      <h2>{{ car.make }} {{ car.model }}</h2>

      <div class="car-details">
        <div class="detail-row">
          <span class="detail-label">Registration Number:</span>
          <span class="detail-value">{{ car.registration_number }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Color:</span>
          <span class="detail-value">{{ car.color }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Engine Size:</span>
          <span class="detail-value">{{ car.engine_size }} cc</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Year of Manufacture:</span>
          <span class="detail-value">{{ car.year_of_manufacture }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date of Manufacture:</span>
          <span class="detail-value">{{ formatDate(car.date_of_manufacture) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">CO₂ Emissions:</span>
          <span class="detail-value">{{ car.co2_emissions }} g/km</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tax Due Date:</span>
          <span class="detail-value">{{ formatDate(car.tax_due_date) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date of Last V5C Issued:</span>
          <span class="detail-value">{{ formatDate(car.date_of_last_v5c_issued) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">First Used Date:</span>
          <span class="detail-value">{{ formatDate(car.first_used_date) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Marked for Export:</span>
          <span class="detail-value">{{ car.marked_for_export ? 'Yes' : 'No' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Outstanding Recall:</span>
          <span class="detail-value">{{ car.has_outstanding_recall ? 'Yes' : 'No' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Type Approval:</span>
          <span class="detail-value">{{ car.type_approval }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Power Output:</span>
          <span class="detail-value">{{ car.power_output }} HP</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Tax Status:</span>
            <span class="detail-value">{{car.tax_status}}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Price:</span>
          <span class="detail-value">£{{ car.price }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Fuel Type:</span>
          <span class="detail-value">{{ car.fuel_type }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Wheel Plan:</span>
          <span class="detail-value">{{ car.wheel_plan }}</span>
        </div>
      </div>
      <button @click="goToPayment" class="payment-button">Go to Payment</button>
    </div>
    <div v-else>
      No car data available.
    </div>
  </div>
</template>

<style scoped>
.car-info {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #099999;
  border: 1px solid black; 
  border-radius: 8px; 
}

.car-info h1 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.car-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: contents;
}

.detail-label {
  font-weight: bold;
  text-align: left;
  color: var(--text-color);
}

.detail-value {
  text-align: left;
  color: var(--text-color);
}

.payment-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: var(--primary-yellow);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.payment-button:hover {
  background-color: #e0ac00;
}
</style>