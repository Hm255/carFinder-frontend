<script setup lang="ts">
import Header from './components/Header.vue';
import ErrorBoundary from './components/ErrorBoundary.vue'
</script>

<template>
  <div id="app">
    <Header />
    <main>
      <ErrorBoundary>
        <router-view />
      </ErrorBoundary>
    </main>
  </div>
</template>

<style>

</style>