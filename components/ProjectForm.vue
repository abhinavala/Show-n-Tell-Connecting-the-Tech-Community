<template>
    <div class="mt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Project Title -->
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                </label>
                <input 
                    v-model="projectData.title"
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your project title"
                    required
                />
            </div>

            <!-- Project Description -->
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Project Description *
                </label>
                <textarea 
                    v-model="projectData.description"
                    rows="3"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your project, what it does, and why it's useful..."
                    required
                ></textarea>
            </div>

            <!-- Category -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                </label>
                <select 
                    v-model="projectData.category"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="">Select category</option>
                    <option value="Web App">Web Application</option>
                    <option value="Mobile App">Mobile Application</option>
                    <option value="Library">Library/Package</option>
                    <option value="Tool">Developer Tool</option>
                    <option value="Game">Game</option>
                    <option value="AI/ML">AI/Machine Learning</option>
                    <option value="Blockchain">Blockchain/Web3</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <!-- Tech Stack -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tech Stack *
                </label>
                <input 
                    v-model="projectData.techStack"
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., React, Node.js, Python"
                    required
                />
            </div>

            <!-- Project Status -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Project Status
                </label>
                <select 
                    v-model="projectData.status"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Active Development">Active Development</option>
                    <option value="Beta">Beta</option>
                    <option value="Production Ready">Production Ready</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Archived">Archived</option>
                </select>
            </div>

            <!-- Collaboration Type -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Looking for Help?
                </label>
                <select 
                    v-model="projectData.collaboration"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">No help needed</option>
                    <option value="Contributors Welcome">Contributors Welcome</option>
                    <option value="Looking for Team">Looking for Team</option>
                    <option value="Paid Work">Paid Work Available</option>
                    <option value="Mentorship">Seeking Mentorship</option>
                </select>
            </div>

            <!-- GitHub URL -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Repository
                </label>
                <input 
                    v-model="projectData.githubUrl"
                    type="url"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/username/repo"
                />
            </div>

            <!-- Live Demo URL -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Live Demo URL
                </label>
                <input 
                    v-model="projectData.demoUrl"
                    type="url"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://your-demo.com"
                />
            </div>

            <!-- Documentation URL -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Documentation URL
                </label>
                <input 
                    v-model="projectData.documentationUrl"
                    type="url"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://docs.your-project.com"
                />
            </div>

            <!-- License -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    License
                </label>
                <select 
                    v-model="projectData.license"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">No license specified</option>
                    <option value="MIT">MIT</option>
                    <option value="Apache 2.0">Apache 2.0</option>
                    <option value="GPL v3">GPL v3</option>
                    <option value="BSD 3-Clause">BSD 3-Clause</option>
                    <option value="CC0">CC0 (Public Domain)</option>
                    <option value="Proprietary">Proprietary</option>
                </select>
            </div>

            <!-- Tags -->
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                </label>
                <input 
                    v-model="projectData.tags"
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., javascript, react, open-source, beginner-friendly"
                />
            </div>

            <!-- Usage Instructions -->
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    How to Use This Project
                </label>
                <textarea 
                    v-model="projectData.usageInstructions"
                    rows="3"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief instructions on how others can use or contribute to your project..."
                ></textarea>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelValue'])

const projectData = ref({
    title: '',
    description: '',
    category: '',
    techStack: '',
    status: 'Active Development',
    collaboration: '',
    githubUrl: '',
    demoUrl: '',
    documentationUrl: '',
    license: '',
    tags: '',
    usageInstructions: ''
})

// Watch for changes and emit updates
watch(projectData, (newValue) => {
    emit('update:modelValue', newValue)
}, { deep: true })

// Initialize with props if provided
onMounted(() => {
    if (props.modelValue) {
        Object.assign(projectData.value, props.modelValue)
    }
})
</script> 