<template>
    <div
        id="SideNavMain"
        :class="[
            'bg-white border-r border-gray-200 h-[calc(100vh-61px)] overflow-hidden transition-all duration-500 ease-in-out min-w-[75px] z-[99999] fixed top-[61px] left-0',
            $generalStore.isSidebarExpanded ? 'shadow-2xl' : '',
            $generalStore.isSidebarExpanded ? (isMobile ? 'w-[85vw]' : 'w-[400px]') : (isMobile ? 'w-[60px]' : 'w-[60px]')
        ]"
    >


        <div class="w-full mx-auto">
            <!-- Main Navigation -->
            <div class="space-y-2">
                <NuxtLink to="/" class="block">
                    <MenuItem 
                        iconString="Trending Projects" 
                        colorString="#3B82F6" 
                        sizeString="30"
                        :showText="$generalStore.isSidebarExpanded || !isMobile"
                    />
                </NuxtLink>
                
                <NuxtLink to="/projects" class="block">
                    <MenuItem 
                        iconString="Browse Projects" 
                        colorString="#10B981" 
                        sizeString="27"
                        :showText="$generalStore.isSidebarExpanded || !isMobile"
                    />
                </NuxtLink>
                
                <MenuItem 
                    iconString="Open Source" 
                    colorString="#8B5CF6" 
                    sizeString="27"
                    :showText="$generalStore.isSidebarExpanded || !isMobile"
                />
                
                <MenuItem 
                    iconString="Looking for Help" 
                    colorString="#F59E0B" 
                    sizeString="27"
                    :showText="$generalStore.isSidebarExpanded || !isMobile"
                />
            </div>

            <div class="border-b ml-2 mt-2" />

            <!-- Toggle Button - Positioned after main nav, before suggested users -->
            <div class="flex justify-center py-3">
                <button 
                    @click="toggleSidebar"
                    class="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors border border-blue-200 shadow-sm"
                >
                    <Icon 
                        :name="$generalStore.isSidebarExpanded ? 'mdi:chevron-left' : 'mdi:chevron-right'" 
                        size="20" 
                        color="#3B82F6"
                    />
                </button>
            </div>

            <!-- Suggested Developers Section -->
            <div class="block">
                <div v-if="$generalStore.isSidebarExpanded || !isMobile" class="text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
                    Suggested developers
                </div>

                <div
                    v-if="$generalStore.suggested"
                    v-for="(sug, index) in $generalStore.suggested"
                    :key="sug.id"
                >
                    <div @click="isLoggedIn(sug)" class="cursor-pointer">
                        <MenuItemFollow 
                            :user="sug" 
                            :showText="$generalStore.isSidebarExpanded || !isMobile"
                            :showIcon="true"
                        />
                    </div>
                </div>

                <button v-if="$generalStore.isSidebarExpanded || !isMobile" class="text-[#3B82F6] pt-1.5 pl-2 text-[13px]">
                    See all
                </button>
                
                <!-- Collapsed indicator -->
                <div v-if="!$generalStore.isSidebarExpanded && isMobile && $generalStore.suggested && $generalStore.suggested.length > 3" 
                     class="text-center py-2">
                    <div class="w-1 h-1 bg-gray-400 rounded-full mx-auto mb-1"></div>
                    <div class="w-1 h-1 bg-gray-400 rounded-full mx-auto mb-1"></div>
                    <div class="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>
                </div>
            </div>

            <!-- Following Section -->
            <div v-if="$userStore.id" class="block">
                <div v-if="$generalStore.isSidebarExpanded || !isMobile" class="border-b ml-2 mt-2" />

                <div v-if="$generalStore.isSidebarExpanded || !isMobile" class="text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
                    Following accounts
                </div>

                <div
                    v-if="$generalStore.following"
                    v-for="(fol, index) in $generalStore.following"
                    :key="fol.id"
                >
                    <div @click="isLoggedIn(fol)" class="cursor-pointer">
                        <MenuItemFollow 
                            :user="fol" 
                            :showText="$generalStore.isSidebarExpanded || !isMobile"
                            :showIcon="true"
                        />
                    </div>
                </div>

                <button v-if="$generalStore.isSidebarExpanded || !isMobile" class="text-[#3B82F6] pt-1.5 pl-2 text-[13px]">See more</button>
                
                <!-- Collapsed indicator -->
                <div v-if="!$generalStore.isSidebarExpanded && isMobile && $generalStore.following && $generalStore.following.length > 3" 
                     class="text-center py-2">
                    <div class="w-1 h-1 bg-gray-400 rounded-full mx-auto mb-1"></div>
                    <div class="w-1 h-1 bg-gray-400 rounded-full mx-auto mb-1"></div>
                    <div class="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>
                </div>
            </div>

            <!-- Footer Links -->
            <div :class="$generalStore.isSidebarExpanded || !isMobile ? 'block' : 'hidden'">
                <div v-if="$generalStore.isSidebarExpanded || !isMobile" class="border-b ml-2 mt-2" />

                <div v-if="$generalStore.isSidebarExpanded || !isMobile" class="text-[11px] text-gray-500">
                    <div class="pt-4 px-2">About Newsroom Show n Tell Shop Contact Careers</div>
                    <div class="pt-4 px-2">Show n Tell for Good Advertise Developers Transparency Community Rewards Browse Embeds</div>
                    <div class="pt-4 px-2">Help Safety Terms Privacy Creator Portal Community Guidelines</div>
                    <div class="pt-4 px-2">© 2024 Show n Tell</div>
                </div>
            </div>

            <div class="pb-14"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const { $generalStore, $userStore } = useNuxtApp()
const route = useRoute()

let isMobile = ref(false)

const toggleSidebar = () => {
    $generalStore.toggleSidebar()
}

const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
}

const isLoggedIn = (user) => {
    if (!$userStore.id) {
        $generalStore.isLoginOpen = true
        return
    }
    // Navigate to user profile
    navigateTo(`/profile/${user.id}`)
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})
</script>