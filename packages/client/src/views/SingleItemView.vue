<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import { useStoreItem } from '@/stores/storeItem'
import BaseModal from '@/components/BaseModal.vue'
import { serverClient } from '@/orpc/client'
import { useRouter } from 'vue-router'

import type { Item } from '@/types/itemType'

const props = defineProps<{
  id: string
}>()

const formState = reactive({
  name: '',
  price: 0,
})

const store = useStoreItem()
const { editStoreItem, deleteStoreItem } = store
const isOpen = ref(false)
const isOpenDelete = ref(false)
const isLoading = ref(false)
const itemData = ref<Item | null>(null)
const router = useRouter()

const fetchItem = async () => {
  isLoading.value = true

  try {
    const client = serverClient()
    const item = await client.store.getStoreItemById({ id: props.id })

    return item
  } catch (error) {
    console.error('Error fetching item:', error)

    return null
  }
}

watch(
  () => props.id,
  async (newId) => {
    if (!newId) return

    const item = await fetchItem()

    itemData.value = item

    formState.name = item?.name || ''
    formState.price = item?.price || 0
  },
  { immediate: true },
)

const handleSave = async (): Promise<void> => {
  if (!itemData.value) return

  try {
    editStoreItem({
      id: props.id,
      name: formState.name,
      price: formState.price,
    })

    const client = serverClient()
    const result = await client.store.updateStoreItem({
      id: props.id,
      name: formState.name,
      price: formState.price,
    })

    // Save New Item To Ref
    itemData.value = result

    console.log('Item updated:', result)
  } catch (error) {
    console.error('Error updating item:', error)
  } finally {
    isOpen.value = false
  }
}

const handleDelete = async (): Promise<void> => {
  if (!itemData.value) return

  try {
    deleteStoreItem(itemData.value)

    const client = serverClient()
    const result = await client.store.deleteStoreItem({ id: props.id })

    console.log('Item deleted:', result)
  } catch (error) {
    console.error('Error Deleting Item: ', error)
  } finally {
    isOpenDelete.value = false

    router.push('/shop')
  }
}
</script>

<template>
  <section>
    <div>
      <h1>Single Item View</h1>
      <p>Item ID: {{ id }}</p>
      <p>Item Name: {{ itemData?.name }}</p>
      <p>Item Price: {{ itemData?.price }}</p>
    </div>

    <button @click="isOpen = true">Edit</button>

    <BaseModal :is-open="isOpen" @close="isOpen = false">
      <template #header>
        <h2>Edit Item</h2>
      </template>

      <form @submit.prevent="handleSave">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" v-model="formState.name" />
        <label for="price">Price</label>
        <input type="number" id="price" name="price" v-model="formState.price" />

        <button type="submit">Edit</button>
      </form>
    </BaseModal>

    <button @click="isOpenDelete = true">Delete</button>

    <BaseModal :is-open="isOpenDelete" @close="isOpenDelete = false">
      <template #header>
        <h2>Delete Item</h2>
      </template>

      <p>Are you sure you want to delete this item?</p>

      <div>
        <button @click="isOpenDelete = false">Cancel</button>
        <button @click="handleDelete">Delete</button>
      </div>
    </BaseModal>
  </section>
</template>

<style></style>
