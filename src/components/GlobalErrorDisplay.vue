<script setup lang="ts">
import { ref, computed, onErrorCaptured, defineProps, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

interface BackendError extends Error {
  response?: {
    status?: number
    data?: { message?: string; [key: string]: any }
  }
}

const { notFound } = defineProps<{ notFound?: boolean }>()
const error = ref<Error | null>(null)

function tryAgain() {
  error.value = null
}

onErrorCaptured((err, instance, info) => {
  console.error("Vue error captured:", err, info, instance)
  error.value = err
  return false
})

axios.interceptors.response.use(
  response => response,
  err => {
    console.error("Backend error captured:", err)
    error.value = err
    return Promise.reject(err)
  }
)

const route = useRoute()
onMounted(() => {
  if (notFound || route.name === 'NotFound') {
    error.value = new Error("404 - Not Found: The page you're looking for doesn't exist.")
  }
})

const errorMessage = computed(() => {
  if (!error.value) return ""
  const backendErr = error.value as BackendError
  if (backendErr.response?.data?.message) {
    return backendErr.response.data.message
  }
  return error.value.message
})
</script>

<template>
  <div>
    <div v-if="error" class="error-display">
      <h2>Something went wrong.</h2>
      <p>{{ errorMessage }}</p>
      <button @click="tryAgain">Try Again</button>
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.error-display {
  padding: 1em;
  margin: 1em;
  background-color: #ffebcc;
  border: 1px solid #ffcc99;
  border-radius: 5px;
  color: #cc6600;
  text-align: center;
}
.error-display h2 {
  margin-bottom: 0.5rem;
}
.error-display p {
  margin-bottom: 1rem;
}
.error-display button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #cc6600;
  color: #fff;
  cursor: pointer;
  border-radius: 3px;
}
</style>
