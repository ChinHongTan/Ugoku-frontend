<template>
  <div class="left-sidebar">
    <!-- Add your left sidebar content here -->
    <h2>Left Sidebar</h2>
    <ul>
      <li>Server 1</li>
      <li>Server 2</li>
      <li>Server 3</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Add any necessary imports and logic here
</script>

<style scoped>
.left-sidebar {
  width: 250px;
  background-color: #f0f0f0;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 60px; /* Height of the AppBar */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
</style>
