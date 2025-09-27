<template>
    <div class="w-full flex items-center hover:bg-gray-100 p-2.5 rounded-md">
        <div class="flex items-center lg:mx-0 mx-auto">
            <Icon :name="icon" :color="colorString" :size="sizeString" />
            <span 
                v-if="showText"
                :class="`text-[${colorString}]`"
                class="pl-[9px] mt-0.5 font-semibold text-[17px]"
            >
                {{ iconString }}
            </span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    iconString: String,
    colorString: String,
    sizeString: String,
    showText: {
        type: Boolean,
        default: true
    }
})

const { iconString, colorString, sizeString, showText } = toRefs(props)

let icon = ref('')

// Map icon strings to icon names
if (iconString.value === 'Trending Projects') icon.value = 'mdi:trending-up'
if (iconString.value === 'Browse Projects') icon.value = 'mdi:folder-search'
if (iconString.value === 'Open Source') icon.value = 'mdi:source-fork'
if (iconString.value === 'Looking for Help') icon.value = 'mdi:handshake'
if (iconString.value === 'For You') icon.value = 'mdi:home'
if (iconString.value === 'Following') icon.value = 'ci:group'
if (iconString.value === 'LIVE') icon.value = 'ri:live-line'
</script>