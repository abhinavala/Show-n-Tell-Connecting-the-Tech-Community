<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div @click="closeModal" class="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b">
                <div class="flex items-center">
                    <span class="text-xl mr-2">📤</span>
                    <h3 class="text-lg font-semibold">Send Message</h3>
                </div>
                <button
                    @click="$emit('close')"
                    class="text-gray-400 hover:text-gray-600 p-1"
                >
                    <span class="text-xl">✕</span>
                </button>
            </div>
            
            <!-- Project Info -->
            <div v-if="project" class="p-4 border-b bg-blue-50">
                <div class="text-sm font-medium text-gray-900">{{ project.title }}</div>
                <div class="text-xs text-gray-600">Message to: {{ project.user?.name }}</div>
            </div>
            
            <!-- Message Form -->
            <div class="p-4">
                <div class="space-y-4">
                    <!-- Subject -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <input
                            v-model="messageForm.subject"
                            type="text"
                            placeholder="Enter message subject..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <!-- Message Type -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                        <select
                            v-model="messageForm.type"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="collaboration">Collaboration Request</option>
                            <option value="question">Question about Project</option>
                            <option value="feedback">Feedback</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <!-- Message Content -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea
                            v-model="messageForm.content"
                            rows="4"
                            placeholder="Type your message here..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        ></textarea>
                    </div>
                    
                    <!-- Contact Preference -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input
                                    v-model="messageForm.contactMethod"
                                    type="radio"
                                    value="email"
                                    class="mr-2"
                                />
                                <span class="text-sm">Email</span>
                            </label>
                            <label class="flex items-center">
                                <input
                                    v-model="messageForm.contactMethod"
                                    type="radio"
                                    value="chat"
                                    class="mr-2"
                                />
                                <span class="text-sm">In-app Chat</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Actions -->
            <div class="p-4 border-t bg-gray-50 flex space-x-3">
                <button
                    @click="closeModal"
                    class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    @click="sendDirectMessage"
                    :disabled="!isFormValid"
                    class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span class="text-lg mr-2">📤</span>
                    Send Message
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    project: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close'])

const { $userStore } = useNuxtApp()

const messageForm = ref({
    subject: '',
    type: 'collaboration',
    content: '',
    contactMethod: 'email'
})

const closeModal = () => {
    emit('close')
    resetForm()
}

const resetForm = () => {
    messageForm.value = {
        subject: '',
        type: 'collaboration',
        content: '',
        contactMethod: 'email'
    }
}

const isFormValid = computed(() => {
    return messageForm.value.subject.trim() && 
           messageForm.value.content.trim() && 
           messageForm.value.contactMethod
})

const sendDirectMessage = () => {
    if (!isFormValid.value) return
    
    const message = {
        id: Date.now(),
        fromUserId: $userStore.id,
        fromUserName: $userStore.name,
        toUserId: props.project?.user?.id,
        toUserName: props.project?.user?.name,
        projectId: props.project?.id,
        projectTitle: props.project?.title,
        ...messageForm.value,
        timestamp: new Date()
    }
    
    // TODO: Send message to backend
    console.log('Sending direct message:', message)
    
    // Show success message
    alert('Message sent successfully!')
    
    closeModal()
}
</script> 