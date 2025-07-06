<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useStoreItem } from '@/stores/storeItem'
import type { Item } from '@/types/itemType'

import StoreCard from '@/components/StoreCard.vue';

const storeItem = useStoreItem()
const items = storeItem.storeItem

const sampleItems = ref<Item[]>(items)
</script>

<template>
  <section>
    <h1>Shop View</h1>

    <ul>
      <li v-for="item in sampleItems" :key="item.id">
        <RouterLink :to="{ name: 'shop-id', params: { id: item.id } }">
          <StoreCard :name="item.name" :price="item.price" />
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style lang=""></style>
