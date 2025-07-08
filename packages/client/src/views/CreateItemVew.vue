<script setup lang="ts">
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useStoreItem } from '@/stores/storeItem'
import { trpc } from '@/trpc'

const isLoading = ref(false)
const store = useStoreItem()
const { setStoreItems } = store
const { storeItem } = storeToRefs(store)

const formState = reactive({
  name: '',
  price: 0,
})

const handleCreateItem = async () => {
  isLoading.value = true

  try {
    console.log('Item to be added: ', formState)

    setStoreItems({
      id: Math.random().toString(),
      name: formState.name,
      price: formState.price,
    })

    // Save Item to DB
    const result = await trpc.createStoreItem.mutate({
      name: formState.name,
      price: formState.price,
    })

    console.log('Store Item: ', storeItem)
  } catch (error) {
    console.error('Error creating item:', error)
  } finally {
    isLoading.value = false

    clearForm()
  }
}

const clearForm = () => {
  formState.name = ''
  formState.price = 0
}
</script>

<template>
  <section>
    <h1>Form View</h1>

    <p>Add Store Item</p>

    <form @submit.prevent="handleCreateItem">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" v-model="formState.name" />
      <label for="price">Price</label>
      <input type="number" id="price" name="price" v-model="formState.price" />

      <button type="submit">Add</button>
      <button type="button" @click="clearForm">Clear</button>
    </form>
  </section>
</template>

<style lang=""></style>
