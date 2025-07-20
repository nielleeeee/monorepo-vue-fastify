<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { trpc } from '@/trpc'
import type { Item } from '@/types/itemType'

import StoreCard from '@/components/StoreCard.vue'

const storeItemDB = ref<Item[]>([])
const isLoading = ref(false)

const sampleFetchItems = async () => {
  isLoading.value = true

  try {
    const items = await trpc.getStoreItems.query({})

    console.log('Fetched items:', items)

    return items.items
  } catch (error) {
    console.error('Error fetching items:', error)

    return []
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  storeItemDB.value = await sampleFetchItems()
})
</script>

<template>
  <section>
    <h1>Shop View</h1>

    <p v-if="isLoading">Loading...</p>
    
    <ul v-if="!isLoading">
      <li v-for="item in storeItemDB" :key="item.id">
        <RouterLink :to="{ name: 'shop-id', params: { id: item.id } }">
          <StoreCard :name="item.name" :price="item.price" />
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style lang=""></style>
