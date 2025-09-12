<script setup lang="ts">
import { ref, computed, onErrorCaptured, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

interface BackendError extends Error {
  response?: {
    status?: number
    data?: { message?: string; [key: string]: any }
  }
}

const props = defineProps<{ notFound?: boolean }>()
const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
  return false
})

axios.interceptors.response.use(
  response => response,
  err => {
    error.value = err
    return Promise.reject(err)
  }
)

const route = useRoute()
onMounted(() => {
  if (props.notFound || route.name === 'NotFound') {
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
      <router-link to="/" class="error-button">Home</router-link>
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
.error-button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #cc6600;
  color: #fff;
  cursor: pointer;
  border-radius: 3px;
}
</style>
