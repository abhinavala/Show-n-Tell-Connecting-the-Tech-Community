<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- Mobile Navigation - Hidden on home page -->
    <MobileNavigation v-if="$route.path !== '/'" />
    
    <!-- Auth Overlay -->
    <AuthOverlay v-if="$generalStore.isLoginOpen" />
    
    <!-- Edit Profile Overlay -->
    <EditProfileOverlay v-if="$generalStore.isEditProfileOpen" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
const { $userStore, $generalStore } = useNuxtApp()
const { isLoginOpen, isEditProfileOpen } = storeToRefs($generalStore)

onMounted(async () => {
    $generalStore.bodySwitch(false) 
    isLoginOpen.value = false
    isEditProfileOpen.value = false

    try {
        await $generalStore.hasSessionExpired()
        await $generalStore.getRandomUsers('suggested')
        await $generalStore.getRandomUsers('following')

        if ($userStore.id) {
            $userStore.getUser()
        }
    } catch (error) {
        console.log(error)
    }
})

watch(() => isLoginOpen.value, (val) => $generalStore.bodySwitch(val) )
watch(() => isEditProfileOpen.value, (val) => $generalStore.bodySwitch(val) )

// Set page title for Show n Tell
useHead({
    title: 'Show n Tell - Developer Project Platform',
    meta: [
        { name: 'description', content: 'Showcase your projects, find collaborators, and share open source code with the developer community' }
    ]
})
</script>
