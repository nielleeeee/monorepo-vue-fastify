<script setup lang="ts">
const props = defineProps<{
  name: string
  price: number
  description?: string
}>()

console.log('StoreCard props: ', props)
</script>

<template>
  <div class="store-card">
    <h2>{{ name }}</h2>
    <p>{{ price }}</p>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.store-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
