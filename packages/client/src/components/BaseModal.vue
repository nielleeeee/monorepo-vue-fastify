<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <slot name="header"> Default Title </slot>
        <button class="close-button" @click="emit('close')">X</button>
      </header>

      <main class="modal-body">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  min-width: 300px;
  max-width: 90vw;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #2b2b2b;
  border-bottom: 1px solid #2b2b2b;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.close-button {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
