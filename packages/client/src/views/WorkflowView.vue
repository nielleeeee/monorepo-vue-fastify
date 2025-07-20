<script lang="ts" setup>
import { ref, reactive } from 'vue'

const SAMPLE_TOKEN = 'sample-token'
const isLoading = ref(false)
const startWorkflowFormState = reactive({
  name: '',
})
const checkWorkflowFormState = reactive({
  id: '',
})

const handleStartWorkflow = async () => {
  isLoading.value = true

  try {
    const workflowCreateResponse = await fetch('http://localhost:8787/test-workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: SAMPLE_TOKEN,
      },
      body: JSON.stringify({
        name: startWorkflowFormState.name,
      }),
    })

    if (!workflowCreateResponse.ok) {
      throw new Error('Failed to start workflow')
    }

    const workflowCreateResponseData = await workflowCreateResponse.json()

    checkWorkflowFormState.id = workflowCreateResponseData.id as string
  } catch (error) {
    console.error('Error starting workflow:', error)
  }
}

const handleCheckWorkflow = async () => {
  isLoading.value = true

  try {
    const workflowStatusResponse = await fetch(
      'http://localhost:8787/test-workflow/' + checkWorkflowFormState.id,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: SAMPLE_TOKEN,
        },
      },
    )

    if (!workflowStatusResponse.ok) {
      throw new Error('Failed to get workflow status')
    }

    const workflowStatusResponseData = await workflowStatusResponse.json()

    console.log('Workflow Start Response: ', workflowStatusResponseData)
  } catch (error) {
    console.error('Error getting workflow status:', error)
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="handleStartWorkflow">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" v-model="startWorkflowFormState.name" />

      <button type="submit">Start Workflow</button>
    </form>

    <form @submit.prevent="handleCheckWorkflow">
      <label for="workflow-id">Workflow ID</label>
      <input type="text" id="workflow-id" name="workflow-id" v-model="checkWorkflowFormState.id" />

      <button type="submit">Check Workflow Status</button>
    </form>
  </div>
</template>

<style scoped></style>
