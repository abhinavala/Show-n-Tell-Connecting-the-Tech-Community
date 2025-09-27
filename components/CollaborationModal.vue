<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div @click="closeModal" class="absolute inset-0 bg-black bg-opacity-50"></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center mb-6">
        <span class="text-2xl mr-3">🔗</span>
        <h2 class="text-2xl font-bold text-gray-900">Collaboration Request</h2>
        <button
          @click="$emit('close')"
          class="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <span class="text-2xl">✕</span>
        </button>
      </div>
      
      <!-- Collaboration Tabs -->
      <div class="border-b">
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
          </button>
        </nav>
      </div>
      
      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto max-h-96">
        <!-- Propose Changes Tab -->
        <div v-if="activeTab === 'propose'" class="p-6">
          <div class="space-y-6">
            <!-- Project Overview -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-medium text-blue-900 mb-2">Project Overview</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-blue-700">Owner:</span>
                  <span class="ml-2 text-gray-700">{{ project?.user?.name }}</span>
                </div>
                <div>
                  <span class="text-blue-700">Category:</span>
                  <span class="ml-2 text-gray-700">{{ project?.category }}</span>
                </div>
                <div>
                  <span class="text-blue-700">Tech Stack:</span>
                  <span class="ml-2 text-gray-700">{{ project?.techStack }}</span>
                </div>
                <div>
                  <span class="text-blue-700">Status:</span>
                  <span class="ml-2 text-gray-700">{{ project?.status }}</span>
                </div>
              </div>
            </div>
            
            <!-- Collaboration Form -->
            <form @submit.prevent="submitCollaboration" class="space-y-6">
              <!-- Collaboration Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Collaboration Type *
                </label>
                <select
                  v-model="collaborationForm.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select collaboration type</option>
                  <option value="feature">New Feature</option>
                  <option value="bugfix">Bug Fix</option>
                  <option value="improvement">Improvement</option>
                  <option value="documentation">Documentation</option>
                  <option value="testing">Testing</option>
                  <option value="design">UI/UX Design</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Collaboration Title *
                </label>
                <input
                  v-model="collaborationForm.title"
                  type="text"
                  placeholder="Brief description of your contribution"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  v-model="collaborationForm.description"
                  rows="6"
                  placeholder="Describe what you want to contribute, why it's valuable, and how you plan to implement it..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                ></textarea>
              </div>
              
              <!-- Implementation Plan -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Implementation Plan
                </label>
                <textarea
                  v-model="collaborationForm.implementationPlan"
                  rows="4"
                  placeholder="Step-by-step plan for implementing your contribution..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <!-- Skills & Experience -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Relevant Skills & Experience
                </label>
                <textarea
                  v-model="collaborationForm.skills"
                  rows="3"
                  placeholder="Describe your relevant skills, experience, and why you're qualified for this collaboration..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <!-- Timeline -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Start Date
                  </label>
                  <input
                    v-model="collaborationForm.startDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Completion
                  </label>
                  <input
                    v-model="collaborationForm.completionDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <!-- Compensation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Compensation Preference
                </label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="collaborationForm.compensation"
                      type="radio"
                      value="volunteer"
                      class="mr-2"
                    />
                    <span class="text-sm">Volunteer (for experience/portfolio)</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="collaborationForm.compensation"
                      type="radio"
                      value="paid"
                      class="mr-2"
                    />
                    <span class="text-sm">Paid collaboration</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="collaborationForm.compensation"
                      type="radio"
                      value="equity"
                      class="mr-2"
                    />
                    <span class="text-sm">Equity/partnership</span>
                  </label>
                </div>
              </div>
              
              <!-- Contact Information -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="collaborationForm.contactMethod"
                      type="radio"
                      value="email"
                      class="mr-2"
                    />
                    <span class="text-sm">Email</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="collaborationForm.contactMethod"
                      type="radio"
                      value="chat"
                      class="mr-2"
                    />
                    <span class="text-sm">In-app Chat</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="collaborationForm.contactMethod"
                      type="radio"
                      value="video"
                      class="mr-2"
                    />
                    <span class="text-sm">Video Call</span>
                  </label>
                </div>
              </div>
              
              <!-- Submit Button -->
              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="!isFormValid"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="mr-2">🚀</span>
                  Submit Collaboration Request
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Active Collaborations Tab -->
        <div v-if="activeTab === 'active'" class="p-6">
          <div v-if="activeCollaborations.length === 0" class="text-center text-gray-500 py-8">
            <span class="text-4xl mb-2 text-gray-300">👥</span>
            <p>No active collaborations yet.</p>
          </div>
          
          <div v-else class="space-y-4">
            <div
              v-for="collab in activeCollaborations"
              :key="collab.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="px-2 py-1 text-xs font-medium rounded-full"
                          :class="getStatusClass(collab.status)">
                      {{ collab.status }}
                    </span>
                    <span class="text-sm text-gray-500">#{{ collab.id }}</span>
                  </div>
                  <h4 class="font-medium text-gray-900 mb-1">{{ collab.title }}</h4>
                  <p class="text-sm text-gray-600 mb-2">{{ collab.description }}</p>
                  <div class="flex items-center space-x-4 text-xs text-gray-500">
                    <span>By {{ collab.collaboratorName }}</span>
                    <span>{{ formatDate(collab.createdAt) }}</span>
                    <span>{{ collab.type }}</span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="viewCollaboration(collab)"
                    class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    View
                  </button>
                  <button
                    v-if="project?.user?.id === $userStore?.id"
                    @click="updateCollaborationStatus(collab.id, 'approved')"
                    class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Project History Tab -->
        <div v-if="activeTab === 'history'" class="p-6">
          <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">Collaboration Statistics</h4>
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ collaborationStats.total }}</div>
                  <div class="text-gray-600">Total Requests</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">{{ collaborationStats.approved }}</div>
                  <div class="text-gray-600">Approved</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-600">{{ collaborationStats.pending }}</div>
                  <div class="text-gray-600">Pending</div>
                </div>
              </div>
            </div>
            
            <div class="space-y-3">
              <h4 class="font-medium text-gray-900">Recent Activity</h4>
                  <div
                    v-for="activity in project.activities"
                    :key="activity.id"
                    class="flex items-center space-x-3 text-sm"
                  >
                    <span class="text-gray-400">{{ getActivityIcon(activity.type) }}</span>
                    <span class="text-gray-600">{{ activity.description }}</span>
                    <span class="text-gray-400">{{ formatDate(activity.timestamp) }}</span>
                  </div>
            </div>
          </div>
        </div>
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

const activeTab = ref('propose')

const tabs = [
  { id: 'propose', name: 'Propose Changes' },
  { id: 'active', name: 'Active Collaborations' },
  { id: 'history', name: 'Project History' }
]

const collaborationForm = ref({
  type: '',
  title: '',
  description: '',
  implementationPlan: '',
  skills: '',
  startDate: '',
  completionDate: '',
  compensation: 'volunteer',
  contactMethod: 'email'
})

const activeCollaborations = ref([
  {
    id: 1,
    title: 'Add dark mode support',
    description: 'Implement a dark theme option for better user experience',
    status: 'pending',
    type: 'feature',
    collaboratorName: 'John Doe',
    createdAt: new Date(Date.now() - 86400000),
    description: 'Add dark mode support'
  },
  {
    id: 2,
    title: 'Fix mobile responsiveness issues',
    description: 'Address layout problems on small screens',
    status: 'approved',
    type: 'bugfix',
    collaboratorName: 'Jane Smith',
    createdAt: new Date(Date.now() - 172800000),
    description: 'Fix mobile responsiveness issues'
  }
])

const collaborationStats = ref({
  total: 5,
  approved: 2,
  pending: 2,
  rejected: 1
})

const collaborationHistory = ref([
  {
    id: 1,
    type: 'collaboration_requested',
    description: 'New collaboration request: Add dark mode support',
    timestamp: new Date(Date.now() - 86400000)
  },
  {
    id: 2,
    type: 'collaboration_approved',
    description: 'Collaboration approved: Fix mobile responsiveness',
    timestamp: new Date(Date.now() - 172800000)
  },
  {
    id: 3,
    type: 'collaboration_completed',
    description: 'Collaboration completed: Performance optimization',
    timestamp: new Date(Date.now() - 259200000)
  }
])

const isFormValid = computed(() => {
  return collaborationForm.value.type &&
         collaborationForm.value.title &&
         collaborationForm.value.description &&
         collaborationForm.value.compensation &&
         collaborationForm.value.contactMethod
})

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  collaborationForm.value = {
    type: '',
    title: '',
    description: '',
    implementationPlan: '',
    skills: '',
    startDate: '',
    completionDate: '',
    compensation: 'volunteer',
    contactMethod: 'email'
  }
}

const submitCollaboration = () => {
  if (!isFormValid.value) return
  
  const collaboration = {
    id: Date.now(),
    projectId: props.project?.id,
    projectTitle: props.project?.title,
    collaboratorId: $userStore.id,
    collaboratorName: $userStore.name,
    collaboratorImage: $userStore.image,
    ...collaborationForm.value,
    status: 'pending',
    createdAt: new Date()
  }
  
  // TODO: Send collaboration request to backend
  console.log('New collaboration request:', collaboration)
  
  // Add to active collaborations
  activeCollaborations.value.unshift(collaboration)
  
  // Show success message
  alert('Collaboration request submitted successfully!')
  
  closeModal()
}

const viewCollaboration = (collab) => {
  // TODO: Implement detailed view
  console.log('Viewing collaboration:', collab)
}

const updateCollaborationStatus = (collabId, status) => {
  const collab = activeCollaborations.value.find(c => c.id === collabId)
  if (collab) {
    collab.status = status
    // TODO: Update backend
    console.log('Updated collaboration status:', collabId, status)
  }
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

const getActivityIcon = (type) => {
  const icons = {
    'request': '📝',
    'approved': '✅',
    'rejected': '❌',
    'comment': '💬',
    'update': '🔄',
    'merge': '🔀'
  }
  return icons[type] || 'ℹ️'
}

const formatDate = (date) => {
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / 86400000)
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}
</script> 