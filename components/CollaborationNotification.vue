<template>
  <div v-if="showNotification" class="fixed top-4 right-4 z-50 max-w-sm">
    <div class="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
      <span class="text-lg mr-2">🔗</span>
      <div class="flex-1">
        <p class="text-sm font-medium text-blue-900">New collaboration request</p>
        <p class="text-xs text-blue-700">{{ notification.message }}</p>
      </div>
      <button
        @click="$emit('close')"
        class="text-blue-400 hover:text-blue-600 p-1"
      >
        <span class="text-sm">✕</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  notification: {
    type: Object,
    default: null
  },
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['view', 'approve', 'close'])

const { $userStore } = useNuxtApp()

const showNotification = ref(true)

const isProjectOwner = computed(() => {
  return props.project?.user?.id === $userStore?.id
})

const closeNotification = () => {
  showNotification.value = false
  emit('close')
}

const viewCollaboration = () => {
  emit('view', props.notification)
  closeNotification()
}

const quickApprove = () => {
  emit('approve', props.notification.id)
  closeNotification()
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return 'Today'
}
</script> 