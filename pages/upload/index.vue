<template>    
    <UploadError :errorType="errorType"/>

    <div 
        v-if="isUploading"
        class="fixed flex items-center justify-center top-0 left-0 w-full h-screen bg-black z-50 bg-opacity-50"
    >
        <Icon class="animate-spin ml-1" name="mingcute:loading-line" size="100" color="#FFFFFF"/>
    </div>

    <UploadLayout>
        <div class="w-full mt-[80px] mb-[40px] bg-white shadow-lg rounded-md py-6 md:px-10 px-4">
            <div>
                <div class="text-[23px] font-semibold">Showcase Your Project</div>
                <div class="text-gray-400 mt-1">Share your project with the developer community</div>
            </div>

            <div class="mt-8 md:flex gap-6">

                <!-- Video Upload Area -->
                <div class="md:mx-0 mx-auto mt-4 mb-6">
                    <div 
                        v-if="!videoFile"
                        @click="openFilePicker"
                        @drop.prevent="handleFileDrop" 
                        @dragover.prevent
                        class="
                            flex 
                            flex-col 
                            items-center 
                            justify-center 
                            w-full 
                            max-w-[260px] 
                            h-[470px] 
                            text-center 
                            p-3 
                            border-2 
                            border-dashed 
                            border-gray-300 
                            rounded-lg 
                            hover:bg-gray-100 
                            cursor-pointer
                        "
                    >
                        <Icon name="majesticons:cloud-upload" size="40" color="#b3b3b1"/>
                        <div class="mt-4 text-[17px]">Upload project demo video (Optional)</div>
                        <div class="mt-1.5 text-gray-500 text-[13px]">Or drag and drop a file</div>
                        <div class="mt-12 text-gray-400 text-sm">MP4</div>
                        <div class="mt-2 text-gray-400 text-[13px]">Up to 5 minutes</div>
                        <div class="mt-2 text-gray-400 text-[13px]">Less than 100 MB</div>
                        <div class="px-2 py-1.5 mt-8 text-white text-[15px] w-[80%] bg-[#3B82F6] rounded-sm">
                            Select file
                        </div>
                    </div>

                    <!-- Video Preview -->
                    <div
                        v-if="videoFile"
                        class="
                            flex 
                            flex-col 
                            items-center 
                            justify-center 
                            w-full 
                            max-w-[260px] 
                            h-[470px] 
                            p-3 
                            rounded-2xl
                            relative
                            bg-gray-50
                        "
                    >
                        <!-- Phone Frame Container - Fixed Dimensions -->
                        <div class="relative w-[234px] h-[444px]">
                            <!-- Phone Case Image -->
                            <img 
                                class="absolute inset-0 w-full h-full z-20 pointer-events-none" 
                                src="~/assets/images/mobile-case.png"
                                alt="Phone case"
                            >
                            
                            <!-- Video Container - Fixed Position -->
                            <div class="absolute top-[13px] left-[13px] right-[13px] bottom-[13px] z-10">
                                <video 
                                    autoplay
                                    loop
                                    muted
                                    class="w-full h-full rounded-xl object-cover"
                                    :src="videoPreviewUrl"
                                />
                            </div>
                            
                            <!-- TikTok Logo -->
                            <img 
                                class="absolute right-4 bottom-6 z-30" 
                                width="90" 
                                src="~/assets/images/tiktok-logo-white.png"
                                alt="Logo"
                            >
                        </div>

                        <!-- File Info Bar - Fixed Position -->
                        <div class="absolute bottom-0 left-0 right-0 flex items-center justify-between z-50 rounded-xl border p-2 border-gray-300 bg-white">
                            <div class="flex items-center truncate">
                                <Icon name="clarity:success-standard-line" size="16" class="min-w-[16px] text-green-500"/>
                                <div class="text-[11px] pl-1 truncate text-ellipsis text-gray-700">{{ videoFile.name }}</div>
                            </div>
                            <button @click="removeVideo" class="text-[11px] ml-2 font-semibold text-blue-600 hover:text-blue-800">
                                Change
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Project Form -->
                <div class="mt-4 mb-6">
                    <div class="flex bg-[#F8F8F8] py-4 px-6">
                        <div>
                            <Icon class="mr-4" size="20" name="mdi:code-braces"/>
                        </div>
                        <div>
                            <div class="text-semibold text-[15px] mb-1.5">Project Showcase</div>
                            <div class="text-semibold text-[13px] text-gray-400">
                                Fill in project details to showcase your work to the developer community
                            </div>
                        </div>
                    </div>

                    <!-- Project Form -->
                    <ProjectForm v-model="projectData" />

                    <div class="mt-5">
                        <div class="flex items-center justify-between">
                            <div class="mb-1 text-[15px]">Additional Notes</div>
                            <div class="text-gray-400 text-[12px]">{{ caption.length }}/150</div>
                        </div>
                        <input 
                            v-model="caption"
                            maxlength="150"
                            type="text"
                            class="
                                w-full
                                border
                                p-2.5
                                rounded-md
                                focus:outline-none
                            "
                            placeholder="Any additional notes about your project..."
                        >
                    </div>

                    <div class="flex gap-3">
                        <button 
                            @click="resetForm"
                            class="px-10 py-2.5 mt-8 border text-[16px] hover:bg-gray-100 rounded-sm"
                        >
                            Discard
                        </button>
                        <button 
                            @click="submitProject"
                            :disabled="!isFormValid"
                            class="px-10 py-2.5 mt-8 border text-[16px] text-white bg-[#3B82F6] rounded-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Showcase Project
                        </button>
                    </div>

                    <div v-if="errors" class="mt-4">
                        <div v-for="(error, key) in errors" :key="key" class="text-red-500 text-sm mb-1">
                            {{ error[0] }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </UploadLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'

const router = useRouter()
const $userStore = useUserStore()

// Simple state management
const videoFile = ref(null)
const videoPreviewUrl = ref(null)
const caption = ref('')
const errorType = ref(null)
const errors = ref(null)
const isUploading = ref(false)
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

definePageMeta({ middleware: 'auth' })

// Form validation
const isFormValid = computed(() => {
    return projectData.value.title && 
           projectData.value.description && 
           projectData.value.category && 
           projectData.value.techStack
})

// Watch for project data changes
watch(projectData, (newValue) => {
    console.log('Project data changed:', newValue)
}, { deep: true })

// Watch caption length
watch(() => caption.value, (newCaption) => {
    if (newCaption.length >= 150) {
        errorType.value = 'caption'
        return
    }
    errorType.value = null
})

// File handling functions
const openFilePicker = () => {
    console.log('Opening file picker...')
    
    // Create a temporary file input
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.mp4'
    input.style.display = 'none'
    
    // Handle file selection
    input.onchange = (event) => {
        const file = event.target.files[0]
        if (file) {
            console.log('File selected:', file)
            setVideoFile(file)
        }
        
        // Clean up
        document.body.removeChild(input)
    }
    
    // Add to DOM and trigger
    document.body.appendChild(input)
    input.click()
}

const handleFileDrop = (event) => {
    console.log('File dropped:', event)
    const file = event.dataTransfer.files[0]
    
    if (file && file.type === 'video/mp4') {
        console.log('Valid video file dropped:', file)
        setVideoFile(file)
    } else {
        console.log('Invalid file dropped:', file)
        errorType.value = 'file'
    }
}

const setVideoFile = (file) => {
    console.log('Setting video file:', file)
    videoFile.value = file
    
    // Create preview URL
    if (videoPreviewUrl.value) {
        URL.revokeObjectURL(videoPreviewUrl.value)
    }
    videoPreviewUrl.value = URL.createObjectURL(file)
    
    console.log('Video preview URL created:', videoPreviewUrl.value)
}

const removeVideo = () => {
    console.log('Removing video...')
    
    // Clean up preview URL
    if (videoPreviewUrl.value) {
        URL.revokeObjectURL(videoPreviewUrl.value)
    }
    
    videoFile.value = null
    videoPreviewUrl.value = null
}

const resetForm = () => {
    console.log('Resetting form...')
    
    // Clean up video
    removeVideo()
    
    // Reset form data
    caption.value = ''
    projectData.value = {
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
    }
    
    // Clear errors
    errors.value = null
    errorType.value = null
}

const submitProject = async () => {
    if (!isFormValid.value) {
        return
    }

    errors.value = null
    isUploading.value = true

    try {
        const formData = new FormData()
        
        // Add video if exists
        if (videoFile.value) {
            formData.append('video', videoFile.value)
        }
        
        // Add caption if exists
        if (caption.value && caption.value.trim()) {
            formData.append('text', caption.value.trim())
        }
        
        // Add project data
        Object.keys(projectData.value).forEach(key => {
            if (projectData.value[key] && projectData.value[key].trim()) {
                formData.append(key, projectData.value[key].trim())
            }
        })

        const response = await $userStore.createPost(formData)
        
        if (response.status === 200) {
            setTimeout(() => {
                router.push('/profile/' + $userStore.id)
                isUploading.value = false
            }, 1000)
        }
    } catch (error) {
        console.error('Upload error:', error)
        
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors
        } else {
            errors.value = { general: ['Upload failed. Please try again.'] }
        }
        isUploading.value = false
    }
}
</script>
