<script setup lang="ts">
  import { ref } from 'vue';
  
  const searchQuery = ref('');
  
  // example compare cars button function
  // const compareCars = () => {
  
  //   console.log('Comparing cars based on search query:', searchQuery.value);
  // };
  
  //example randomise car button function
  const randomiseCar = () => {
    
    console.log('Randomising a car selection');
  };
  </script>

<template>
    <div class="main-content">
      <h1>CarFinder</h1>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search for cars..."
      />
      <div class="buttons">
        <button><a class="Link" href="/ComparisonPage">Compare</a></button>
        <button @click="randomiseCar">Randomiser</button>
      </div>
    </div>
  </template>
  
  
  <style scoped>
  .main-content {
    background-color: #87CEEB; 
    padding: 2rem;
    text-align: center;
    min-height: calc(100vh - 64px); 
  }
  
  h1 {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }
  
  input[type="text"] {
    padding: 0.75rem;
    font-size: 1.2rem;
    width: 60%;
    max-width: 500px;
    border: none;
    border-radius: 8px;
    margin-bottom: 2rem;
  }
  
  .buttons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #F2BE00; 
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #e0ac00;
  }

  .Link {
  text-decoration: none; /* Removes underline */
  color: inherit; /* Inherit color from the button */
  /* Add any other styles you want */
}

/* Optional: Add hover styles */
.Link:hover {
  text-decoration: underline; /* Add underline on hover */
  color: blue; /* Change color on hover */
}
  </style>
  