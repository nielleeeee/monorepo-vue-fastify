import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Item } from '@/types/itemType'

export const useStoreItem = defineStore('storeItem', () => {
  const storeItem = ref<Item[]>([])

  const setStoreItems = (item: Item | Item[]) => {
    storeItem.value = [...storeItem.value, ...(Array.isArray(item) ? item : [item])]
  }

  const editStoreItem = (item: Item) => {
    const index = storeItem.value.findIndex((i) => i.id === item.id)
    storeItem.value[index] = item
  }

  return { storeItem, setStoreItems, editStoreItem }
})
