<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>

    <h2 v-if="counterStore.count">Count: {{ counterStore.count }}</h2>

    <p v-if="counterStore.doubleCount">Double Count: {{ counterStore.doubleCount }}</p>

    <button @click="counterStore.increment">Increment Count</button>
  </div>
</template>

<style>
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
