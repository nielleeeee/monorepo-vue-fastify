<script lang="ts" setup>
import { ref, reactive } from 'vue'

const SAMPLE_TOKEN = 'sample-token'
const isLoading = ref(false)
const startWorkflowFormState = reactive({
  name: '',
  email: '',
  subject: '',
  text: '',
})

const handleStartWorkflow = async () => {
  isLoading.value = true

  try {
    const emailWorkflow = await fetch('http://localhost:8787/test-workflow-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: SAMPLE_TOKEN,
      },
      body: JSON.stringify({
        name: startWorkflowFormState.name,
        email: startWorkflowFormState.email,
        subject: startWorkflowFormState.subject,
        text: startWorkflowFormState.text,
      }),
    })

    if (!emailWorkflow.ok) {
      throw new Error('Failed to start workflow')
    }

    const emailWorkflowResponseData = await emailWorkflow.json()

    console.log('Email Workflow Start Response: ', emailWorkflowResponseData)
  } catch (error) {
    console.error('Error starting workflow:', error)
  } finally {
    clearForm()
  }
}

const clearForm = () => {
  startWorkflowFormState.name = ''
  startWorkflowFormState.email = ''
  startWorkflowFormState.subject = ''
  startWorkflowFormState.text = ''
}
</script>

<template>
  <div>
    <form class="email-form" @submit.prevent="handleStartWorkflow">
      <div class="form-input">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" v-model="startWorkflowFormState.name" />
      </div>

      <div class="form-input">
        <label for="email">Email</label>
        <input type="text" id="email" name="email" v-model="startWorkflowFormState.email" />
      </div>

      <div class="form-input">
        <label for="subject">Subject</label>
        <input type="text" id="subject" name="subject" v-model="startWorkflowFormState.subject" />
      </div>

      <div class="form-input">
        <label for="text">Email Body</label>
        <textarea id="text" name="text" v-model="startWorkflowFormState.text" />
      </div>

      <button type="submit">Start Workflow</button>
    </form>
  </div>
</template>

<style scoped>
.email-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 4rem;
}

.form-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
</style>
