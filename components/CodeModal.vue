<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div @click="closeModal" class="absolute inset-0 bg-black bg-opacity-50"></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b bg-gray-50">
        <div class="flex items-center">
          <span class="text-2xl mr-3">💻</span>
          <div>
            <h3 class="text-xl font-semibold text-gray-900">Project Code</h3>
            <p class="text-sm text-gray-600">{{ project?.title }}</p>
          </div>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <span class="text-xl">✕</span>
        </button>
      </div>
      
      <!-- Content -->
      <div class="flex-1 overflow-y-auto max-h-96">
        <div class="p-6">
          <!-- Project Overview -->
          <div class="bg-blue-50 p-4 rounded-lg mb-6">
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
          
          <!-- Code Repository -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-3">Code Repository</h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-600">👾</span>
                  <span class="font-medium text-gray-900">GitHub Repository</span>
                </div>
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Public</span>
              </div>
              
              <div class="space-y-2 text-sm">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-500">Repository:</span>
                  <a href="#" class="text-blue-600 hover:underline">github.com/username/project-name</a>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-500">Last Updated:</span>
                  <span class="text-gray-700">2 days ago</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-500">Stars:</span>
                  <span class="text-gray-700">24</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-500">Forks:</span>
                  <span class="text-gray-700">8</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Code Snippets -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-3">Key Code Snippets</h4>
            <div class="space-y-4">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Main Component</span>
                  <button class="text-xs text-blue-600 hover:text-blue-700">Copy</button>
                </div>
                <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre class="text-sm"><code>import React from 'react';

const ProjectComponent = () => {
  return (
    &lt;div className="project-container"&gt;
      &lt;h1&gt;{{ project?.title }}&lt;/h1&gt;
      &lt;p&gt;{{ project?.description }}&lt;/p&gt;
    &lt;/div&gt;
  );
};

export default ProjectComponent;</code></pre>
                </div>
              </div>
              
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">API Configuration</span>
                  <button class="text-xs text-blue-600 hover:text-blue-700">Copy</button>
                </div>
                <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre class="text-sm"><code>const API_CONFIG = {
  baseURL: 'https://api.example.com',
  endpoints: {
    projects: '/projects',
    users: '/users'
  }
};

export default API_CONFIG;</code></pre>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Installation & Setup -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-3">Installation & Setup</h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="space-y-3 text-sm">
                <div>
                  <span class="font-medium text-gray-700">1. Clone the repository:</span>
                  <div class="bg-gray-900 text-gray-100 p-2 rounded mt-1 font-mono">
                    git clone https://github.com/username/project-name.git
                  </div>
                </div>
                <div>
                  <span class="font-medium text-gray-700">2. Install dependencies:</span>
                  <div class="bg-gray-900 text-gray-100 p-2 rounded mt-1 font-mono">
                    npm install
                  </div>
                </div>
                <div>
                  <span class="font-medium text-gray-700">3. Run the project:</span>
                  <div class="bg-gray-900 text-gray-100 p-2 rounded mt-1 font-mono">
                    npm run dev
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              @click="closeModal"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              @click="forkProject"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span class="text-xl mr-2">🔄</span>
              Fork Project
            </button>
            <button
              @click="downloadCode"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <span class="text-xl mr-2">⬇️</span>
              Download Code
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

const emit = defineEmits(['close', 'fork'])

const closeModal = () => {
  emit('close')
}

const forkProject = () => {
  emit('fork', props.project)
}

const downloadCode = () => {
  // TODO: Implement code download functionality
  console.log('Downloading code for project:', props.project?.id)
  
  // For now, just show a message
  alert('Code download started! This would typically download a ZIP file of the project.')
}
</script> 