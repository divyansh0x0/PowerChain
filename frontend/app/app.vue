<script lang="ts" setup>
useThemeManager();

</script>
<template>
    <div class="app-container">

      <NuxtPage/>
      <KeepAlive>
        <NavigationBar/>
      </KeepAlive>
    </div>
</template>
<style scoped>
.app-container {
  background-color: var(--color-surface-container-lowest);
  position: relative;
}

</style>
