<template>
  <nav class="header">
    <ul class="nav-list">
      <li class="nav-item">
        <a href="/">Home</a>
      </li>
      <li class="nav-item">
        <a href="/Cars">Search</a>
      </li>
      <li class="nav-item">
        <a href="/Favourites">Favourites</a>
      </li>
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

.nav-item {
  width: 640px; 
  height: 40px; 
  margin-right: 1rem;
  display: flex; 
  align-items: center; 
  justify-content: center; 
}

.nav-list a {
  text-decoration: none;
  color: #000;
  font-family: 'Inter', sans-serif; 
  font-size: 40px; 
  font-weight: bold;
}

.nav-list a:hover {
  text-decoration: underline;
  color: blue;
}
</style>