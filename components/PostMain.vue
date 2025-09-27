<template>
    <div :id="`ProjectMain-${post.id}`" class="flex border-b py-6">
        <div @click="isLoggedIn(post.user)" class="cursor-pointer">
            <img class="rounded-full max-h-[60px]" width="60" :src="post.user.image">
        </div>
        <div class="pl-3 w-full px-4">
            <div class="flex items-center justify-between pb-0.5">
                <button @click="isLoggedIn(post.user)">
                    <span class="font-bold hover:underline cursor-pointer">
                        {{ $generalStore.allLowerCaseNoCaps(post.user.name) }}
                    </span>
                    <span class="text-[13px] text-light text-gray-500 pl-1 cursor-pointer">
                        {{ post.user.name }}
                    </span>
                </button>

                <button 
                    @click="followUser(post.user)"
                    class="border text-[15px] px-[21px] py-0.5 border-[#3B82F6] text-[#3B82F6] hover:bg-[#EFF6FF] font-semibold rounded-md transition-colors"
                >
                    {{ isFollowing ? 'Following' : 'Follow' }}
                </button>
            </div>
            
            <!-- Project Title and Description -->
            <div class="text-[18px] font-bold pb-2 text-gray-800">{{ post.title || 'Project Title' }}</div>
            <div class="text-[15px] pb-2 break-words md:max-w-[400px] max-w-[300px] text-gray-700">{{ post.description || post.text }}</div>
            
            <!-- Project Tags and Categories -->
            <div class="text-[14px] text-gray-500 pb-2">
                <span v-if="post.category" class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2">{{ post.category }}</span>
                <span v-if="post.techStack" class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mr-2">{{ post.techStack }}</span>
                <span v-if="post.collaboration" class="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">{{ post.collaboration }}</span>
            </div>
            
            <!-- Project Status and Actions -->
            <div class="text-[14px] pb-2 flex items-center font-semibold text-gray-600">
                <Icon name="mdi:code-braces" size="17"/>
                <div class="px-1">{{ post.status || 'Active Development' }}</div>
                <Icon name="mdi:heart" size="20" class="ml-2"/>
            </div>

            <div class="mt-2.5 flex">
                <div
                    @click="displayPost(post)"
                    class="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer"
                >
                    <video 
                        v-if="post.video"
                        ref="video"
                        loop
                        muted
                        class="rounded-xl object-cover mx-auto h-full" 
                        :src="post.video" 
                    />
                    <img 
                        class="absolute right-2 bottom-14" 
                        width="90" 
                        src="~/assets/images/tiktok-logo-white.png"
                    >
                </div>
                <div class="relative mr-[75px]">
                    <div class="absolute bottom-0 pl-2">
                        <div class="pb-4 text-center">
                            <button
                                @click="isLiked ? unlikePost(post) : likePost(post)"
                                class="rounded-full bg-gray-200 p-2 cursor-pointer hover:bg-gray-300 transition-colors"
                            >
                                <Icon 
                                    name="mdi:heart" 
                                    size="25" 
                                    :color="isLiked ? '#3B82F6' : ''"
                                />
                            </button>
                            <span class="text-xs text-gray-800 font-semibold">{{ post.likes?.length || 0 }}</span>
                        </div>

                        <div class="pb-4 text-center">
                            <button @click="openCollaboration(post)" class="rounded-full bg-gray-200 p-2 cursor-pointer hover:bg-gray-300 transition-colors">
                                <Icon name="mdi:handshake" size="25"/>
                            </button>
                            <span class="text-xs text-gray-800 font-semibold">Collaborate</span>
                        </div>

                        <div class="pb-4 text-center">
                            <button @click="showCodeModal(post)" class="rounded-full bg-gray-200 p-2 cursor-pointer hover:bg-gray-300 transition-colors">
                                <Icon name="mdi:code-tags" size="25"/>
                            </button>
                            <span class="text-xs text-gray-800 font-semibold">View Code</span>
                        </div>

                        <div class="text-center">
                            <button @click="shareProject(post)" class="rounded-full bg-gray-200 p-2 cursor-pointer hover:bg-gray-300 transition-colors">
                                <Icon name="ri:share-forward-fill" size="25"/>
                            </button>
                            <span class="text-xs text-gray-800 font-semibold">Share</span>
                        </div>

                        <div class="text-center pt-4">
                            <button @click="openChat(post)" class="rounded-full bg-blue-100 hover:bg-blue-200 p-2 cursor-pointer transition-colors">
                                <Icon name="mdi:chat" size="25" class="text-blue-600"/>
                            </button>
                            <span class="text-xs text-gray-800 font-semibold">Chat</span>
                        </div>

                        <div class="text-center pt-4">
                            <button @click="openMessageModal(post)" class="rounded-full bg-green-100 hover:bg-green-200 p-2 cursor-pointer transition-colors">
                                <Icon name="mdi:send" size="25" class="text-green-600"/>
                            </button>
                            <span class="text-xs text-gray-800 font-semibold">Message</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <CollaborationModal 
            :is-open="isCollaborationModalOpen"
            :project="selectedProject"
            @close="closeCollaborationModal"
            @submit="handleCollaborationSubmit"
        />
        
        <CodeModal 
            :is-open="isCodeModalOpen"
            :project="selectedProject"
            @close="closeCodeModal"
            @fork="handleProjectFork"
        />
        
        <ChatModal 
            :is-open="isChatModalOpen"
            :project="selectedProject"
            @close="closeChatModal"
        />
        
        <MessageModal 
            :is-open="isMessageModalOpen"
            :project="selectedProject"
            @close="closeMessageModal"
        />
        
        <!-- Collaboration Notification -->
        <CollaborationNotification 
            v-if="showCollaborationNotification"
            :notification="collaborationNotification"
            :project="post"
            @view="handleCollaborationView"
            @approve="handleCollaborationApprove"
            @close="closeCollaborationNotification"
        />
    </div>
</template>

<script setup>
import CollaborationModal from './CollaborationModal.vue'
import CodeModal from './CodeModal.vue'
import ChatModal from './ChatModal.vue'
import MessageModal from './MessageModal.vue'

const { $generalStore, $userStore } = useNuxtApp()
const props = defineProps(['post'])
const { post } = toRefs(props)

const router = useRouter()

let video = ref(null)
const isCollaborationModalOpen = ref(false)
const isCodeModalOpen = ref(false)
const isChatModalOpen = ref(false)
const isMessageModalOpen = ref(false)
const selectedProject = ref(null)
const showCollaborationNotification = ref(false)
const collaborationNotification = ref(null)

onMounted(() => {
    let observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            console.log('Element is playing' + post.value.id);
            video.value.play()
        } else {
            console.log('Element is paused' + post.value.id);
            video.value.pause()
        }

    }, { threshold: [0.6] });

    observer.observe(document.getElementById(`ProjectMain-${post.value.id}`));
})

onBeforeUnmount(() => {
    video.value.pause()
    video.value.currentTime = 0
    video.value.src = ''
})

const isLiked = computed(() => {
    let res = post.value.likes.find(like => like.user_id === $userStore.id)
    if (res) {
        return true
    }
    return false
})

const isFollowing = computed(() => {
    // TODO: Check if current user is following this user
    return false
})

const likePost = async (post) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }
    try {
        await $userStore.likePost(post)
    } catch (error) {
        console.log(error)
    }
}

const unlikePost = async (post) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }
    try {
        await $userStore.unlikePost(post, false)
    } catch (error) {
        console.log(error)
    }
}

const followUser = (user) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }
    
    // TODO: Implement follow functionality
    console.log('Following user:', user.id)
    
    // For now, just show a success message
    alert(`You are now following ${user.name}!`)
}

const isLoggedIn = (user) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }
    setTimeout(() => router.push(`/profile/${user.id}`), 200)
}

const displayPost = (post) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }

    $generalStore.setBackUrl('/')
    $generalStore.selectedPost = null
    setTimeout(() => router.push(`/post/${post.id}`), 200)
}

// New methods for project showcase functionality
const showCollaborationModal = (post) => {
    selectedProject.value = post
    isCollaborationModalOpen.value = true
}

const closeCollaborationModal = () => {
    isCollaborationModalOpen.value = false
    selectedProject.value = null
}

const showCodeModal = (post) => {
    selectedProject.value = post
    isCodeModalOpen.value = true
}

const closeCodeModal = () => {
    isCodeModalOpen.value = false
    selectedProject.value = null
}

const handleCollaborationSubmit = (collaborationData) => {
    // TODO: Send collaboration request to backend
    console.log('Collaboration request:', collaborationData)
    
    // Show success message
    alert('Collaboration request submitted successfully!')
    
    // Close modal
    closeCollaborationModal()
}

const handleProjectFork = (project) => {
    // TODO: Handle project forking
    console.log('Forking project:', project)
    
    // For now, just show a message
    alert('Project forked successfully! You can now work on your own copy.')
    
    // Close modal
    closeCodeModal()
}

// Chat and messaging functionality
const openChat = (post) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }
    
    selectedProject.value = post
    isChatModalOpen.value = true
}

const closeChatModal = () => {
    isChatModalOpen.value = false
    selectedProject.value = null
}

const openMessageModal = (post) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }
    
    selectedProject.value = post
    isMessageModalOpen.value = true
}

const closeMessageModal = () => {
    isMessageModalOpen.value = false
    selectedProject.value = null
}

const shareProject = (post) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }
    
    // Create shareable URL
    const shareUrl = `${window.location.origin}/post/${post.id}`
    
    // Try to use native sharing if available
    if (navigator.share) {
        navigator.share({
            title: post.title || 'Check out this project!',
            text: post.description || post.text || 'Amazing project on Show n Tell',
            url: shareUrl
        }).catch(console.error)
    } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Project link copied to clipboard!')
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = shareUrl
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            alert('Project link copied to clipboard!')
        })
    }
}

const openCollaboration = (post) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }
    
    selectedProject.value = post
    isCollaborationModalOpen.value = true
}

const handleCollaborationView = (notification) => {
    // Open collaboration modal with the specific request
    isCollaborationModalOpen.value = true
    // TODO: Set active tab to show the specific collaboration
}

const handleCollaborationApprove = (collaborationId) => {
    // TODO: Update collaboration status in backend
    console.log('Quick approved collaboration:', collaborationId)
    
    // Show success message
    alert('Collaboration approved!')
    
    // Close notification
    closeCollaborationNotification()
}

const closeCollaborationNotification = () => {
    showCollaborationNotification.value = false
    collaborationNotification.value = null
}

// Add this to show collaboration notifications
const showCollaborationRequest = (notification) => {
    collaborationNotification.value = notification
    showCollaborationNotification.value = true
}

// Expose this method for external use
defineExpose({
    showCollaborationRequest
})
</script>