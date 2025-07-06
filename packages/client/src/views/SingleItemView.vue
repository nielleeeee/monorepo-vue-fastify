<script setup lang="ts">
import { reactive, computed, watch, ref } from 'vue'
import { useStoreItem } from '@/stores/storeItem'
import BaseModal from '@/components/BaseModal.vue'

const props = defineProps<{
  id: string
}>()

const formState = reactive({
  name: '',
  price: 0,
})

const isOpen = ref(false)

const store = useStoreItem()

const singleItem = computed(() => store.storeItem.find((item) => item.id === props.id))

const handleSave = () => {
  if (!singleItem.value) return

  console.log('Item to be updated: ', formState)

  store.editStoreItem({
    id: props.id,
    name: formState.name,
    price: formState.price,
  })

  // Close Modal
  isOpen.value = false

  console.log('Store Item: ', store.storeItem)
}

watch(
  singleItem,
  (newItem) => {
    if (!newItem) return

    formState.name = newItem.name
    formState.price = newItem.price
  },
  { immediate: true },
)
</script>

<template>
  <section>
    <div>
      <h1>Single Item View</h1>
      <p>Item ID: {{ id }}</p>
      <p>Item Name: {{ singleItem?.name }}</p>
      <p>Item Price: {{ singleItem?.price }}</p>
    </div>

    <button @click="isOpen = true">Edit</button>

    <BaseModal :is-open="isOpen" @close="isOpen = false">
      <form @submit.prevent="handleSave">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" v-model="formState.name" />
        <label for="price">Price</label>
        <input type="number" id="price" name="price" v-model="formState.price" />

        <button type="submit">Edit</button>
      </form>
    </BaseModal>
  </section>
</template>

<style lang=""></style>
