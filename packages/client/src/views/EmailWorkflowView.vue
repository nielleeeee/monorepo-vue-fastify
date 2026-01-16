<script lang="ts" setup>
import { serverClient } from '@/orpc/client'
import { ref, reactive } from 'vue'

const isLoading = ref(false)
const startWorkflowFormState = reactive({
  name: '',
  email: '',
  subject: '',
  emailMessage: '',
})

const handleStartWorkflow = async () => {
  isLoading.value = true

  const body = {
    name: startWorkflowFormState.name,
    email: startWorkflowFormState.email,
    subject: startWorkflowFormState.subject,
    emailMessage: startWorkflowFormState.emailMessage,
  }

  console.log('Email Workflow Body: ', body)

  try {
    const client = serverClient()

    const emailWorkflowResponse = await client.workflow.testEmail({
      email: startWorkflowFormState.email,
      name: startWorkflowFormState.name,
      subject: startWorkflowFormState.subject,
      emailMessage: startWorkflowFormState.emailMessage,
    })

    console.log('Email Workflow Start Response: ', emailWorkflowResponse)
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
  startWorkflowFormState.emailMessage = ''
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
        <label for="emailMessage">Email Body</label>
        <textarea
          id="emailMessage"
          name="emailMessage"
          v-model="startWorkflowFormState.emailMessage"
        />
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
