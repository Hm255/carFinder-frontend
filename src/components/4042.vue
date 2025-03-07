<template>
    <div class="not-found">
      <h1>404 - Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <router-link to="/">Go Home</router-link>
    </div>
  </template>
  
  <style scoped>
  .not-found {
    text-align: center;
    padding: 2rem;
  }
  .not-found h1 {
       color: var(--text-color)
  }
   .not-found p {
       color: var(--text-color)
   }
  </style>