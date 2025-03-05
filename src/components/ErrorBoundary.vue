<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const error = ref<Error | null>(null);

function resetError() {
  error.value = null;
}


onErrorCaptured((err, instance, info) => {
  console.error("Error captured in boundary:", err, info);
  error.value = err;
  return false;
});
</script>

<template>
    <div>
      <div v-if="error" class="error-boundary">
        <h2>Something went wrong.</h2>
        <p>{{ error.message }}</p>
        <button @click="resetError">Try Again</button>
      </div>
 
      <div v-else>
        <slot />
      </div>
    </div>
  </template>
  

  
  <style scoped>
  .error-boundary {
    padding: 1em;
    margin: 1em;
    background-color: #ffebcc;
    border: 1px solid #ffcc99;
    border-radius: 5px;
    color: #cc6600;
  }
  </style>
  