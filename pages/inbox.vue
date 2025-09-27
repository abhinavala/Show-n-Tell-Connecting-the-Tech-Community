<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-3xl font-bold text-gray-900">Inbox</h1>
          <p class="mt-2 text-gray-600">Messages, notifications, and collaboration requests</p>
        </div>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
            <span v-if="tab.count > 0" class="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Messages Tab -->
      <div v-if="activeTab === 'messages'" class="space-y-4">
        <div v-if="messages.length === 0" class="text-center text-gray-500 py-12">
          <Icon name="mdi:email-outline" size="48" class="mx-auto mb-4 text-gray-300"/>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p class="text-gray-600">When you receive messages from other users, they'll appear here.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="message in messages"
            :key="message.id"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            @click="openMessage(message)"
          >
            <div class="flex items-start space-x-4">
              <img :src="message.sender.image" class="w-12 h-12 rounded-full"/>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-medium text-gray-900">{{ message.sender.name }}</h3>
                  <span class="text-sm text-gray-500">{{ formatTime(message.timestamp) }}</span>
                </div>
                <p class="text-gray-600 mb-2">{{ message.subject }}</p>
                <p class="text-gray-500 text-sm line-clamp-2">{{ message.content }}</p>
                <div class="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                  <span v-if="message.project" class="flex items-center space-x-1">
                    <Icon name="mdi:folder" size="14"/>
                    <span>{{ message.project.title }}</span>
                  </span>
                  <span class="flex items-center space-x-1">
                    <Icon name="mdi:tag" size="14"/>
                    <span>{{ message.type }}</span>
                  </span>
                </div>
              </div>
              <div v-if="!message.read" class="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Notifications Tab -->
      <div v-if="activeTab === 'notifications'" class="space-y-4">
        <div v-if="notifications.length === 0" class="text-center text-gray-500 py-12">
          <Icon name="mdi:bell-outline" size="48" class="mx-auto mb-4 text-gray-300"/>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p class="text-gray-600">You'll see notifications about your projects and collaborations here.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <Icon :name="getNotificationIcon(notification.type)" size="24" class="text-blue-600"/>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-medium text-gray-900">{{ notification.title }}</h3>
                  <span class="text-sm text-gray-500">{{ formatTime(notification.timestamp) }}</span>
                </div>
                <p class="text-gray-600 mb-2">{{ notification.message }}</p>
                <div class="flex items-center space-x-4 text-xs text-gray-500">
                  <span v-if="notification.project" class="flex items-center space-x-1">
                    <Icon name="mdi:folder" size="14"/>
                    <span>{{ notification.project.title }}</span>
                  </span>
                  <span class="flex items-center space-x-1">
                    <Icon name="mdi:tag" size="14"/>
                    <span>{{ notification.type }}</span>
                  </span>
                </div>
              </div>
              <div v-if="!notification.read" class="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Collaboration Requests Tab -->
      <div v-if="activeTab === 'collaborations'" class="space-y-4">
        <div v-if="collaborationRequests.length === 0" class="text-center text-gray-500 py-12">
          <Icon name="mdi:handshake" size="48" class="mx-auto mb-4 text-gray-300"/>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No collaboration requests</h3>
          <p class="text-gray-600">When someone wants to collaborate on your projects, they'll appear here.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="request in collaborationRequests"
            :key="request.id"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-start space-x-4">
              <img :src="request.collaborator.image" class="w-12 h-12 rounded-full"/>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-medium text-gray-900">{{ request.collaborator.name }} wants to collaborate</h3>
                  <span class="text-sm text-gray-500">{{ formatTime(request.timestamp) }}</span>
                </div>
                <p class="text-gray-600 mb-2">{{ request.title }}</p>
                <p class="text-gray-500 text-sm mb-3">{{ request.description }}</p>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span class="text-gray-500">Project:</span>
                    <span class="ml-2 font-medium">{{ request.project.title }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Type:</span>
                    <span class="ml-2 font-medium capitalize">{{ request.type }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Compensation:</span>
                    <span class="ml-2 font-medium capitalize">{{ request.compensation }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Timeline:</span>
                    <span class="ml-2 font-medium">{{ request.startDate ? formatDate(request.startDate) : 'Flexible' }}</span>
                  </div>
                </div>
                <div class="flex space-x-3">
                  <button
                    @click="approveCollaboration(request.id)"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    @click="rejectCollaboration(request.id)"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    @click="viewCollaborationDetails(request)"
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const router = useRouter()

const activeTab = ref('messages')

const tabs = [
  { id: 'messages', name: 'Messages', count: 0 },
  { id: 'notifications', name: 'Notifications', count: 0 },
  { id: 'collaborations', name: 'Collaboration Requests', count: 0 }
]

const messages = ref([
  {
    id: 1,
    sender: { name: 'Sarah Chen', image: 'https://via.placeholder.com/48x48' },
    subject: 'Collaboration on AI Project',
    content: 'Hi! I saw your AI-powered code review project and I\'d love to collaborate. I have experience with TensorFlow and could help with the ML components.',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    project: { title: 'AI-Powered Code Review' },
    type: 'collaboration'
  },
  {
    id: 2,
    sender: { name: 'Mike Johnson', image: 'https://via.placeholder.com/48x48' },
    subject: 'Question about your React project',
    content: 'Great work on the mobile fitness tracker! I was wondering if you\'re planning to add offline support? I could help implement that feature.',
    timestamp: new Date(Date.now() - 7200000),
    read: true,
    project: { title: 'Mobile Fitness Tracker' },
    type: 'question'
  }
])

const notifications = ref([
  {
    id: 1,
    title: 'New collaboration request',
    message: 'Sarah Chen wants to collaborate on your AI-Powered Code Review project',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    project: { title: 'AI-Powered Code Review' },
    type: 'collaboration'
  },
  {
    id: 2,
    title: 'Project viewed',
    message: 'Your Mobile Fitness Tracker project was viewed 15 times today',
    timestamp: new Date(Date.now() - 86400000),
    read: true,
    project: { title: 'Mobile Fitness Tracker' },
    type: 'analytics'
  }
])

const collaborationRequests = ref([
  {
    id: 1,
    collaborator: { name: 'Sarah Chen', image: 'https://via.placeholder.com/48x48' },
    title: 'Add dark mode support',
    description: 'I\'d like to implement a dark theme option for better user experience. I have experience with CSS-in-JS and theme systems.',
    timestamp: new Date(Date.now() - 3600000),
    project: { title: 'AI-Powered Code Review' },
    type: 'feature',
    compensation: 'volunteer',
    startDate: new Date(Date.now() + 86400000)
  }
])

onMounted(() => {
  // Update tab counts
  tabs[0].count = messages.value.filter(m => !m.read).length
  tabs[1].count = notifications.value.filter(n => !n.read).length
  tabs[2].count = collaborationRequests.value.length
})

const openMessage = (message) => {
  // TODO: Open message detail modal or navigate to conversation
  console.log('Opening message:', message)
}

const handleNotificationClick = (notification) => {
  if (notification.project) {
    router.push(`/post/${notification.project.id}`)
  }
}

const approveCollaboration = (requestId) => {
  // TODO: Approve collaboration in backend
  console.log('Approving collaboration:', requestId)
  // Remove from requests and add to active collaborations
  collaborationRequests.value = collaborationRequests.value.filter(r => r.id !== requestId)
  tabs[2].count = collaborationRequests.value.length
}

const rejectCollaboration = (requestId) => {
  // TODO: Reject collaboration in backend
  console.log('Rejecting collaboration:', requestId)
  // Remove from requests
  collaborationRequests.value = collaborationRequests.value.filter(r => r.id !== requestId)
  tabs[2].count = collaborationRequests.value.length
}

const viewCollaborationDetails = (request) => {
  // TODO: Open collaboration details modal
  console.log('Viewing collaboration details:', request)
}

const getNotificationIcon = (type) => {
  const icons = {
    collaboration: 'mdi:handshake',
    analytics: 'mdi:chart-line',
    project: 'mdi:folder',
    message: 'mdi:email'
  }
  return icons[type] || 'mdi:bell'
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return date.toLocaleDateString()
}
</script> 