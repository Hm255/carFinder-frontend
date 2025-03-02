<template>
  <nav class="header">
    <ul class="nav-list">
      <li class="nav-item">
        <router-link to="/">Home</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/cars">Search</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/favourites">Favourites</router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.header {
  background-color: #F2BE00;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  justify-content: space-around;
}

.nav-item {
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-item:last-child{
        margin-right: 0;
}


.nav-list a { 
  text-decoration: none;
  color: #000;
  font-family: 'Inter', sans-serif;
  font-size: 40px;
  font-weight: bold;
  display: block; 
  padding: 0.5rem; 
}

.nav-list a:hover { 
    text-decoration: underline;
    color: blue;
}

/* Style the active link */
.nav-list a.router-link-active {
  text-decoration: underline; 
  color:  #0C00F0; 
}

</style>