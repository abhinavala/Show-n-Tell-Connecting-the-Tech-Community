<template>
  <div class="h-screen bg-black overflow-hidden relative z-0">
    <!-- TikTok-style Video Feed -->
    <div class="relative h-full">
      <!-- Video Container -->
      <div 
        v-for="(post, index) in $generalStore.posts" 
        :key="post.id"
        :class="[
          'absolute inset-0 transition-transform duration-300 ease-out',
          currentIndex === index ? 'translate-y-0' : 
          index < currentIndex ? '-translate-y-full' : 'translate-y-full'
        ]"
      >
        <!-- Video Background -->
        <div 
          class="relative w-full h-full bg-gray-900"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <video
            v-if="post.video"
            :ref="el => setVideoRef(el, index)"
            :src="post.video"
            class="w-full h-full object-cover"
            loop
            muted
            @click="togglePlayPause(index)"
            @touchend="handleDoubleTap(post)"
            @loadstart="onVideoLoadStart(index)"
            @canplay="onVideoCanPlay(index)"
            @error="onVideoError(index)"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <div class="text-center text-white bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-gray-600">
              <span class="text-5xl mb-4 block">📹</span>
              <p class="text-xl font-semibold mb-2">No video available</p>
              <p class="text-gray-300">This project doesn't have a demo video</p>
            </div>
          </div>
          
          <!-- Loading Overlay -->
          <div 
            v-if="videoLoadingStates[index]"
            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div class="text-center text-white">
              <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-lg font-medium">Loading video...</p>
            </div>
          </div>
          
          <!-- Heart Animation Overlay -->
          <div 
            v-if="heartAnimationStates[index]"
            class="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span class="text-6xl animate-pulse">❤️</span>
          </div>
        </div>

        <!-- Project Info Overlay (Right Side) -->
        <div class="absolute right-4 bottom-32 flex flex-col items-center space-y-6">
          <!-- Like Button -->
          <div class="text-center">
            <button
              @click="isLiked(post) ? unlikePost(post) : likePost(post)"
              class="w-10 h-10 bg-black bg-opacity-60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-80 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <span 
                class="text-lg transform transition-all duration-200"
                :class="isLiked(post) ? 'text-red-500 scale-110' : 'text-white'"
              >
                {{ isLiked(post) ? '❤️' : '🤍' }}
              </span>
            </button>
            <span class="text-white text-sm font-medium mt-2 block drop-shadow-lg">{{ post.likes?.length || 0 }}</span>
          </div>

          <!-- Collaborate Button -->
          <div class="text-center">
            <button
              @click="openCollaboration(post)"
              class="w-10 h-10 bg-black bg-opacity-60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-80 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <span class="text-lg text-white">👥</span>
            </button>
            <span class="text-white text-sm font-medium mt-2 block drop-shadow-lg">Collaborate</span>
          </div>

          <!-- View Code Button -->
          <div class="text-center">
            <button
              @click="showCodeModal(post)"
              class="w-10 h-10 bg-black bg-opacity-60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-80 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <span class="text-lg text-white">💻</span>
            </button>
            <span class="text-white text-sm font-medium mt-2 block drop-shadow-lg">Code</span>
          </div>

          <!-- Share Button -->
          <div class="text-center">
            <button
              @click="shareProject(post)"
              class="w-10 h-10 bg-black bg-opacity-60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-80 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <span class="text-lg text-white">📤</span>
            </button>
            <span class="text-white text-sm font-medium mt-2 block drop-shadow-lg">Share</span>
          </div>

          <!-- Chat Button -->
          <div class="text-center">
            <button
              @click="openChat(post)"
              class="w-10 h-10 bg-black bg-opacity-60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-80 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <span class="text-lg text-white">💬</span>
            </button>
            <span class="text-white text-sm font-medium mt-2 block drop-shadow-lg">Chat</span>
          </div>
        </div>

        <!-- Project Info (Bottom) -->
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div class="flex items-start space-x-3">
            <!-- User Avatar -->
            <img 
              :src="post.user?.image" 
              class="w-12 h-12 rounded-full border-2 border-white"
              @click="viewProfile(post.user)"
            />
            
            <!-- Project Details -->
            <div class="flex-1 text-white">
              <h3 class="text-lg font-bold mb-1">{{ post.title || 'Project Title' }}</h3>
              <p class="text-sm text-gray-200 mb-2">{{ post.description || post.text }}</p>
              
              <!-- Project Tags -->
              <div class="flex flex-wrap gap-2 mb-3">
                <span v-if="post.category" class="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                  {{ post.category }}
                </span>
                <span v-if="post.techStack" class="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                  {{ post.techStack }}
                </span>
                <span v-if="post.collaboration" class="px-2 py-1 bg-orange-600 text-white text-xs rounded-full">
                  {{ post.collaboration }}
                </span>
              </div>
              
              <!-- User Info -->
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium">{{ post.user?.name }}</span>
                <button
                  @click="followUser(post.user)"
                  class="px-3 py-1 text-xs border border-white text-white rounded-full hover:bg-white hover:text-black transition-colors"
                >
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar (Top) -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gray-600">
          <div 
            class="h-full bg-white transition-all duration-300"
            :style="{ width: `${(currentIndex + 1) / $generalStore.posts.length * 100}%` }"
          ></div>
        </div>

        <!-- Navigation Arrows -->
        <button
          v-if="currentIndex > 0"
          @click="previousPost"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-90 hover:scale-110 transition-all duration-200 shadow-lg border border-gray-600"
        >
          <span class="text-lg text-white">⬆️</span>
        </button>
        
        <button
          v-if="currentIndex < $generalStore.posts.length - 1"
          @click="nextPost"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-90 hover:scale-110 transition-all duration-200 shadow-lg border border-gray-600"
        >
          <span class="text-lg text-white">⬇️</span>
        </button>
      </div>

      <!-- No Posts Message -->
      <div v-if="!$generalStore.posts || $generalStore.posts.length === 0" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center text-white bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-8 border border-gray-600">
          <span class="text-6xl mb-6 block">📁</span>
          <h3 class="text-3xl font-bold mb-3">No projects yet</h3>
          <p class="text-gray-300 mb-8 text-lg">Be the first to share your amazing project!</p>
          <NuxtLink
            to="/upload"
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            <span class="mr-3 text-xl">📤</span>
            Upload Your First Project
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-md border-t border-gray-700">
      <div class="flex justify-around py-4 px-2">
        <NuxtLink
          to="/"
          class="flex flex-col items-center text-blue-400 hover:text-blue-300 transition-all duration-200 group"
        >
          <div class="w-8 h-8 bg-blue-600 bg-opacity-20 rounded-xl flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-200">
            <span class="text-lg">🏠</span>
          </div>
          <span class="text-xs mt-1 font-medium">Home</span>
        </NuxtLink>
        
        <NuxtLink
          to="/discover"
          class="flex flex-col items-center text-gray-300 hover:text-blue-400 transition-all duration-200 group"
        >
          <div class="w-8 h-8 bg-gray-700 bg-opacity-30 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:bg-opacity-20 transition-all duration-200">
            <span class="text-lg">🔍</span>
          </div>
          <span class="text-xs mt-1 font-medium">Discover</span>
        </NuxtLink>
        
        <button
          type="button"
          @click.prevent="handleUploadClick"
          class="flex flex-col items-center text-white transition-all duration-200 group"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:from-blue-400 hover:to-blue-500 transition-all duration-200 transform hover:scale-105">
            <span class="text-xl text-white font-bold">+</span>
          </div>
          <span class="text-xs mt-1 font-medium text-gray-300">Upload</span>
        </button>
        
        <button
          @click="handleCollaborateClick"
          class="flex flex-col items-center text-gray-300 hover:text-blue-400 transition-all duration-200 group"
        >
          <div class="w-8 h-8 bg-gray-700 bg-opacity-30 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:bg-opacity-20 transition-all duration-200">
            <span class="text-lg">🤝</span>
          </div>
          <span class="text-xs mt-1 font-medium">Collaborate</span>
        </button>
        
        <button
          @click="handleInboxClick"
          class="flex flex-col items-center text-gray-300 hover:text-blue-400 transition-all duration-200 group"
        >
          <div class="w-8 h-8 bg-gray-700 bg-opacity-30 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:bg-opacity-20 transition-all duration-200">
            <span class="text-lg">✉️</span>
          </div>
          <span class="text-xs mt-1 font-medium">Inbox</span>
        </button>
        
        <button
          @click="handleProfileClick"
          class="flex flex-col items-center text-gray-300 hover:text-blue-400 transition-all duration-200 group"
        >
          <div class="w-8 h-8 bg-gray-700 bg-opacity-30 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:bg-opacity-20 transition-all duration-200 overflow-hidden">
            <img 
              v-if="$userStore?.image"
              :src="$userStore.image"
              class="w-full h-full object-cover"
              alt="Profile"
            />
            <span v-else class="text-lg">👤</span>
          </div>
          <span class="text-xs mt-1 font-medium">Profile</span>
        </button>
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
  </div>
</template>

<script setup>
import CollaborationModal from '~/components/CollaborationModal.vue'
import CodeModal from '~/components/CodeModal.vue'
import ChatModal from '~/components/ChatModal.vue'

const { $generalStore, $userStore } = useNuxtApp()
const router = useRouter()

// Current post index
const currentIndex = ref(0)

// Modal states
const isCollaborationModalOpen = ref(false)
const isCodeModalOpen = ref(false)
const isChatModalOpen = ref(false)
const selectedProject = ref(null)

// Video refs
const videoRefs = ref([])

// Loading states for videos
const videoLoadingStates = ref([])

// Heart animation states
const heartAnimationStates = ref([])

onMounted(async () => {
  try {
    await $generalStore.getAllUsersAndPosts()
  } catch (error) {
    console.log(error)
  }
})

// Set video ref
const setVideoRef = (el, index) => {
  if (el) {
    videoRefs.value[index] = el
  }
}

// Navigation
const nextPost = () => {
  if (currentIndex.value < $generalStore.posts.length - 1) {
    currentIndex.value++
    playCurrentVideo()
  }
}

const previousPost = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    playCurrentVideo()
  }
}

// Double-tap to like
const lastTap = ref(0)
const doubleTapDelay = 300

const handleDoubleTap = (post) => {
  const currentTime = new Date().getTime()
  const tapLength = currentTime - lastTap.value
  
  if (tapLength < doubleTapDelay && tapLength > 0) {
    // Double tap detected - like the post
    if (!isLiked(post)) {
      likePost(post)
      // Show heart animation
      showHeartAnimation(post.id)
    }
  }
  
  lastTap.value = currentTime
}

const showHeartAnimation = (postId) => {
  const index = $generalStore.posts.findIndex(post => post.id === postId)
  if (index !== -1) {
    heartAnimationStates.value[index] = true
    setTimeout(() => {
      heartAnimationStates.value[index] = false
    }, 1000) // Hide after 1 second
  }
}

// Auto-play current video when it becomes visible
const playCurrentVideo = () => {
  if (videoRefs.value[currentIndex.value]) {
    const video = videoRefs.value[currentIndex.value]
    video.currentTime = 0
    video.play().catch(e => {
      console.log('Auto-play prevented:', e)
    })
  }
}

// Pause other videos
const pauseOtherVideos = () => {
  videoRefs.value.forEach((video, index) => {
    if (video && index !== currentIndex.value) {
      video.pause()
    }
  })
}

const togglePlayPause = (index) => {
  const video = videoRefs.value[index]
  if (video) {
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }
}

// Touch/swipe handling
const touchStartY = ref(0)
const touchEndY = ref(0)
const minSwipeDistance = 50

const handleTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY
}

const handleTouchMove = (e) => {
  touchEndY.value = e.touches[0].clientY
}

const handleTouchEnd = () => {
  if (!touchStartY.value || !touchEndY.value) return
  
  const distance = touchStartY.value - touchEndY.value
  const isUpSwipe = distance > minSwipeDistance
  const isDownSwipe = distance < -minSwipeDistance
  
  if (isUpSwipe && currentIndex.value < $generalStore.posts.length - 1) {
    nextPost()
  } else if (isDownSwipe && currentIndex.value > 0) {
    previousPost()
  }
  
  // Reset touch values
  touchStartY.value = 0
  touchEndY.value = 0
}

// Video loading handlers
const onVideoLoadStart = (index) => {
  videoLoadingStates.value[index] = true
}

const onVideoCanPlay = (index) => {
  videoLoadingStates.value[index] = false
}

const onVideoError = (index) => {
  videoLoadingStates.value[index] = false
  console.error(`Video error for index ${index}:`, videoRefs.value[index].error)
}

// Modal functions
const openCollaboration = (post) => {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true
    return
  }
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

// Utility functions
const isLiked = (post) => {
  return post.likes?.find(like => like.user_id === $userStore.id)
}

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
  alert(`You are now following ${user.name}!`)
}

const viewProfile = (user) => {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true
    return
  }
  router.push(`/profile/${user.id}`)
}

const shareProject = (post) => {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true
    return
  }
  
  const shareUrl = `${window.location.origin}/post/${post.id}`
  
  if (navigator.share) {
    navigator.share({
      title: post.title || 'Check out this project!',
      text: post.description || post.text || 'Amazing project on Show n Tell',
      url: shareUrl
    }).catch(console.error)
  } else {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Project link copied to clipboard!')
    }).catch(() => {
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

const handleCollaborationSubmit = (collaborationData) => {
  console.log('Collaboration request:', collaborationData)
  alert('Collaboration request submitted successfully!')
  closeCollaborationModal()
}

const handleProjectFork = (project) => {
  console.log('Forking project:', project)
  alert('Project forked successfully! You can now work on your own copy.')
  closeCodeModal()
}

// Watch for current index changes to auto-play videos
watch(currentIndex, () => {
  nextTick(() => {
    pauseOtherVideos()
    playCurrentVideo()
  })
})

// Keyboard navigation
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      previousPost()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      nextPost()
    } else if (e.key === ' ') {
      e.preventDefault()
      togglePlayPause(currentIndex.value)
    }
  })
})

const handleUploadClick = (event) => {
  event.preventDefault()
  event.stopPropagation()
  
  console.log('Upload button clicked')
  console.log('User store ID:', $userStore.id)
  console.log('User store:', $userStore)
  
  if (!$userStore.id) {
    console.log('User not logged in, opening login modal')
    $generalStore.isLoginOpen = true
    return false
  }
  
  console.log('User logged in, navigating to upload page')
  router.push('/upload')
  return false
}

const handleProfileClick = () => {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true
  } else {
    router.push(`/profile/${$userStore.id}`)
  }
}

const handleCollaborateClick = () => {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true
    return
  }
  router.push('/collaborations')
}

const handleInboxClick = () => {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true
    return
  }
  router.push('/inbox')
}
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 0px;
}

/* Hide scrollbar for Firefox */
* {
  scrollbar-width: none;
}

/* Ensure full height */
.h-screen {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile */
}

/* Mobile touch optimizations */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Smooth transitions */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Video container optimizations */
video {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* Button hover states for mobile */
@media (hover: none) {
  button:hover {
    background-color: inherit;
  }
}

/* Icon text hiding */
.icon {
  font-family: inherit;
}

/* Ensure icons display properly */
[data-icon] {
  font-family: inherit;
}

/* Hide icon fallback text */
.icon::before,
.icon::after {
  content: none !important;
}

/* Hide any text that might appear from icon components */
.icon-text {
  display: none !important;
}

/* Loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
