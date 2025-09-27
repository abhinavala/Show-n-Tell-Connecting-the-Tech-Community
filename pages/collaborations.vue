<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center mb-6">
            <span class="text-2xl mr-3">🔗</span>
            <h1 class="text-3xl font-bold text-gray-900">Collaborations</h1>
          </div>
          <p class="mt-2 text-gray-600">Manage your project collaborations and requests</p>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="text-2xl text-blue-600">🔗</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Requests</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="text-2xl text-yellow-600">⏰</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="text-2xl text-green-600">✅</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Approved</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.approved }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="text-2xl text-purple-600">🏁</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Completed</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.completed }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
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
        
        <!-- Tab Content -->
        <div class="p-6">
          <!-- My Requests Tab -->
          <div v-if="activeTab === 'my-requests'" class="space-y-4">
            <div v-if="myRequests.length === 0" class="text-center text-gray-500 py-12">
              <span class="text-4xl mx-auto mb-4 text-gray-300 block">🔗</span>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No collaboration requests yet</h3>
              <p class="text-gray-600">Start collaborating on projects by clicking the collaborate button on any project!</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="request in myRequests"
                :key="request.id"
                class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-3">
                      <span class="px-3 py-1 text-sm font-medium rounded-full"
                            :class="getStatusClass(request.status)">
                        {{ request.status }}
                      </span>
                      <span class="text-sm text-gray-500">#{{ request.id }}</span>
                      <span class="text-sm text-gray-500">{{ formatDate(request.createdAt) }}</span>
                    </div>
                    
                    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ request.title }}</h3>
                    <p class="text-gray-600 mb-3">{{ request.description }}</p>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span class="text-gray-500">Project:</span>
                        <span class="ml-2 font-medium">{{ request.projectTitle }}</span>
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
                        <span class="text-gray-500">Contact:</span>
                        <span class="ml-2 font-medium capitalize">{{ request.contactMethod }}</span>
                      </div>
                    </div>
                    
                    <div v-if="request.feedback" class="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p class="text-sm text-gray-600">
                        <span class="font-medium">Feedback:</span> {{ request.feedback }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex flex-col space-y-2 ml-4">
                    <button
                      @click="viewRequest(request)"
                      class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      v-if="request.status === 'pending'"
                      @click="cancelRequest(request.id)"
                      class="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Received Requests Tab -->
          <div v-if="activeTab === 'received'" class="space-y-4">
            <div v-if="receivedRequests.length === 0" class="text-center text-gray-500 py-12">
              <span class="text-4xl mx-auto mb-4 text-gray-300 block">📥</span>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No received requests</h3>
              <p class="text-gray-600">You haven't received any collaboration requests yet.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="request in receivedRequests"
                :key="request.id"
                class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-3">
                      <span class="px-3 py-1 text-sm font-medium rounded-full"
                            :class="getStatusClass(request.status)">
                        {{ request.status }}
                      </span>
                      <span class="text-sm text-gray-500">#{{ request.id }}</span>
                      <span class="text-sm text-gray-500">{{ formatDate(request.createdAt) }}</span>
                    </div>
                    
                    <div class="flex items-center space-x-3 mb-3">
                      <img 
                        :src="request.collaboratorImage || 'https://via.placeholder.com/32x32'"
                        class="w-10 h-10 rounded-full object-cover"
                        alt="Collaborator"
                      />
                      <div>
                        <p class="font-medium text-gray-900">{{ request.collaboratorName }}</p>
                        <p class="text-sm text-gray-500">wants to collaborate</p>
                      </div>
                    </div>
                    
                    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ request.title }}</h3>
                    <p class="text-gray-600 mb-3">{{ request.description }}</p>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                      <div>
                        <span class="text-gray-500">Contact:</span>
                        <span class="ml-2 font-medium capitalize">{{ request.contactMethod }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex flex-col space-y-2 ml-4">
                    <button
                      @click="viewRequest(request)"
                      class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    <div v-if="request.status === 'pending'" class="flex space-x-2">
                      <button
                        @click="approveRequest(request.id)"
                        class="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        @click="rejectRequest(request.id)"
                        class="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Active Collaborations Tab -->
          <div v-if="activeTab === 'active'" class="space-y-4">
            <div v-if="activeCollaborations.length === 0" class="text-center text-gray-500 py-12">
              <span class="text-4xl mx-auto mb-4 text-gray-300 block">🤝</span>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No active collaborations</h3>
              <p class="text-gray-600">Approved collaborations will appear here once they're in progress.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="collab in activeCollaborations"
                :key="collab.id"
                class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-3">
                      <span class="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                      <span class="text-sm text-gray-500">#{{ collab.id }}</span>
                      <span class="text-sm text-gray-500">Started {{ formatDate(collab.approvedAt) }}</span>
                    </div>
                    
                    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ collab.title }}</h3>
                    <p class="text-gray-600 mb-3">{{ collab.description }}</p>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span class="text-gray-500">Project:</span>
                        <span class="ml-2 font-medium">{{ collab.projectTitle }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Collaborator:</span>
                        <span class="ml-2 font-medium">{{ collab.collaboratorName }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Progress:</span>
                        <span class="ml-2 font-medium">{{ collab.progress || 0 }}%</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Deadline:</span>
                        <span class="ml-2 font-medium">{{ collab.completionDate ? formatDate(collab.completionDate) : 'Flexible' }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex flex-col space-y-2 ml-4">
                    <button
                      @click="viewCollaboration(collab)"
                      class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      @click="updateProgress(collab.id)"
                      class="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    >
                      Update Progress
                    </button>
                  </div>
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

const { $userStore } = useNuxtApp()

const activeTab = ref('my-requests')

const tabs = [
  { id: 'my-requests', name: 'My Requests', count: 0 },
  { id: 'received', name: 'Received Requests', count: 0 },
  { id: 'active', name: 'Active Collaborations', count: 0 }
]

const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  completed: 0
})

const myRequests = ref([])
const receivedRequests = ref([])
const activeCollaborations = ref([])

onMounted(() => {
  loadCollaborations()
})

const loadCollaborations = () => {
  // TODO: Load from backend
  // For now, using sample data
  myRequests.value = [
    {
      id: 1,
      title: 'Add dark mode support',
      description: 'Implement a dark theme option for better user experience',
      status: 'pending',
      type: 'feature',
      projectTitle: 'Show n Tell Platform',
      compensation: 'volunteer',
      contactMethod: 'email',
      createdAt: new Date(Date.now() - 86400000)
    }
  ]
  
  receivedRequests.value = [
    {
      id: 2,
      title: 'Fix mobile responsiveness issues',
      description: 'Address layout problems on small screens',
      status: 'pending',
      type: 'bugfix',
      collaboratorName: 'Jane Smith',
      collaboratorImage: 'https://via.placeholder.com/32x32',
      compensation: 'paid',
      contactMethod: 'chat',
      startDate: new Date(Date.now() + 86400000),
      createdAt: new Date(Date.now() - 172800000)
    }
  ]
  
  activeCollaborations.value = [
    {
      id: 3,
      title: 'Performance optimization',
      description: 'Improve loading times and overall performance',
      projectTitle: 'Show n Tell Platform',
      collaboratorName: 'Mike Johnson',
      progress: 75,
      approvedAt: new Date(Date.now() - 259200000),
      completionDate: new Date(Date.now() + 604800000)
    }
  ]
  
  // Update stats
  stats.value = {
    total: myRequests.value.length + receivedRequests.value.length + activeCollaborations.value.length,
    pending: myRequests.value.filter(r => r.status === 'pending').length + 
             receivedRequests.value.filter(r => r.status === 'pending').length,
    approved: activeCollaborations.value.length,
    completed: 0
  }
  
  // Update tab counts
  tabs[0].count = myRequests.value.length
  tabs[1].count = receivedRequests.value.filter(r => r.status === 'pending').length
  tabs[2].count = activeCollaborations.value.length
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / 86400000)
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}

const viewRequest = (request) => {
  // TODO: Open detailed view modal
  console.log('Viewing request:', request)
}

const cancelRequest = (requestId) => {
  if (confirm('Are you sure you want to cancel this collaboration request?')) {
    // TODO: Cancel in backend
    myRequests.value = myRequests.value.filter(r => r.id !== requestId)
    loadCollaborations()
  }
}

const approveRequest = (requestId) => {
  // TODO: Approve in backend
  const request = receivedRequests.value.find(r => r.id === requestId)
  if (request) {
    request.status = 'approved'
    activeCollaborations.value.push({
      ...request,
      approvedAt: new Date(),
      progress: 0
    })
    loadCollaborations()
  }
}

const rejectRequest = (requestId) => {
  if (confirm('Are you sure you want to reject this collaboration request?')) {
    // TODO: Reject in backend
    const request = receivedRequests.value.find(r => r.id === requestId)
    if (request) {
      request.status = 'rejected'
      loadCollaborations()
    }
  }
}

const viewCollaboration = (collab) => {
  // TODO: Open collaboration details modal
  console.log('Viewing collaboration:', collab)
}

const updateProgress = (collabId) => {
  const progress = prompt('Enter progress percentage (0-100):')
  if (progress && !isNaN(progress)) {
    const collab = activeCollaborations.value.find(c => c.id === collabId)
    if (collab) {
      collab.progress = Math.min(100, Math.max(0, parseInt(progress)))
      // TODO: Update in backend
    }
  }
}
</script> 