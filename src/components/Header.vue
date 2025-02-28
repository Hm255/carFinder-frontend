  <script setup lang="ts">
  // maybe
  </script>

<template>
    <nav class="header">
      <ul class="nav-list">
        <li><a href="/">Home</a></li>
        <li><a href="/Cars">Search</a></li>
        <li><a href="/Favourites">Favourites</a></li>
      </ul>
    </nav>
  </template>
  
  <style scoped>
  .header {
    background-color: #F2BE00; 
    padding: 1rem;
  }
  
  .nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .nav-list li {
    margin-right: 1rem;
  }
  
  .nav-list a {
    text-decoration: none;
    color: #000; 
    font-weight: bold;
  }
  </style>
  