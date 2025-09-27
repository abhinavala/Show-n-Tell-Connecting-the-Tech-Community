<template>
  <nav class="mobile-nav-bar">
    <NuxtLink 
      to="/" 
      class="mobile-nav-item"
      :class="{ 'text-blue-600': $route.path === '/' }"
    >
      <span class="mobile-nav-icon text-2xl">🏠</span>
      <span class="mobile-nav-text">Home</span>
    </NuxtLink>
    
    <NuxtLink 
      to="/discover" 
      class="mobile-nav-item"
      :class="{ 'text-blue-600': $route.path === '/discover' }"
    >
      <span class="mobile-nav-icon text-2xl">🔍</span>
      <span class="mobile-nav-text">Discover</span>
    </NuxtLink>
    
    <button 
      @click="handleCollaborateClick"
      class="mobile-nav-item"
      :class="{ 'text-blue-600': $route.path === '/collaborations' }"
    >
      <span class="mobile-nav-icon text-2xl">🔗</span>
      <span class="mobile-nav-text">Collaborate</span>
    </button>
    
    <div class="mobile-nav-item">
      <button 
        @click="openUpload"
        class="mobile-upload-btn"
      >
        <span class="text-white text-xl">+</span>
      </button>
    </div>
    
    <button 
      @click="handleInboxClick"
      class="mobile-nav-item"
      :class="{ 'text-blue-600': $route.path === '/inbox' }"
    >
      <span class="mobile-nav-icon text-2xl">✉️</span>
      <span class="mobile-nav-text">Inbox</span>
    </button>
    
    <button 
      @click="handleProfileClick"
      class="mobile-nav-item"
      :class="{ 'text-blue-600': $route.path.startsWith('/profile') }"
    >
      <img 
        v-if="$userStore?.image"
        :src="$userStore.image"
        class="w-6 h-6 rounded-full object-cover"
        alt="Profile"
      />
      <span v-else class="text-2xl">👤</span>
      <span class="mobile-nav-text">Profile</span>
    </button>
  </nav>
</template>

<script setup>
const { $userStore, $generalStore } = useNuxtApp()
const router = useRouter()

const openUpload = () => {
  if (!$userStore?.id) {
    $generalStore.isLoginOpen = true
  } else {
    router.push('/upload')
  }
}

const handleCollaborateClick = () => {
  if (!$userStore?.id) {
    $generalStore.isLoginOpen = true
  } else {
    router.push('/collaborations')
  }
}

const handleInboxClick = () => {
  if (!$userStore?.id) {
    $generalStore.isLoginOpen = true
  } else {
    router.push('/inbox')
  }
}

const handleProfileClick = () => {
  if (!$userStore?.id) {
    $generalStore.isLoginOpen = true
  } else {
    router.push(`/profile/${$userStore.id}`)
  }
}
</script>

<style scoped>
.mobile-upload-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  touch-action: manipulation;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.mobile-upload-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.mobile-upload-btn:active {
  transform: scale(0.95);
}
</style> 