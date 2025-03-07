<script setup lang="ts">
import GlobalErrorDisplay from './components/GlobalErrorDisplay.vue';
import Header from './components/Header.vue';

</script>

<template>
  <div id="app">
    <Header />
    <main>
      <GlobalErrorDisplay>
        <router-view />
      </GlobalErrorDisplay>
    </main>
  </div>
</template>

<style>

</style>