<template>
    <TopNav/>
    <div 
        :class="[
            'mx-auto w-full lg:px-2.5 px-0'
        ]"
    >
        <div class="flex">
            <SideNavMain />
            <div 
                :class="[
                    'flex-1 transition-all duration-500 ease-in-out relative z-0',
                    $generalStore.isSidebarExpanded ? 'ml-0' : 'ml-[80px]'
                ]"
            >
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const { $generalStore } = useNuxtApp()
</script>
