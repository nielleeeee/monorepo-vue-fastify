<script setup lang="ts">
import { reactive } from 'vue'
import { useStoreItem } from '@/stores/storeItem'

const storeItem = useStoreItem()

const formState = reactive({
  name: '',
  price: 0,
})

const handleSave = () => {
  console.log('Item to be added: ', formState)

  storeItem.setStoreItem({
    id: Math.random().toString(),
    name: formState.name,
    price: formState.price,
  })

  console.log('Store Item: ', storeItem.storeItem)

  clearForm()
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

    <form @submit.prevent="handleSave">
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
