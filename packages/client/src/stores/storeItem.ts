import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Item } from '@/types/itemType'

const initialItems: Item[] = [
  { id: '1', name: 'Item 1', price: 100 },
  { id: '2', name: 'Item 2', price: 200 },
  { id: '3', name: 'Item 3', price: 300 },
]

export const useStoreItem = defineStore('storeItem', () => {
  const storeItem = ref<Item[]>(initialItems)

  const setStoreItem = (item: Item) => {
    storeItem.value = [...storeItem.value, item]
  }

  const editStoreItem = (item: Item) => {
    const index = storeItem.value.findIndex((i) => i.id === item.id)
    storeItem.value[index] = item
  }

  return { storeItem, setStoreItem, editStoreItem }
})
