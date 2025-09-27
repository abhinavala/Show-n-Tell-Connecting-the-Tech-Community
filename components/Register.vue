<template>
    <div class="text-center text-[28px] mb-4 font-bold">Sign up</div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Full name"
            v-model:input="name"
            inputType="text"
            :autoFocus="true"
            :error="errors && errors.name ? errors.name[0] : ''"
        />
    </div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Email address"
            v-model:input="email"
            inputType="email"
            :error="errors && errors.email ? errors.email[0] : ''"
        />
    </div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Password"
            v-model:input="password"
            inputType="password"
            :error="errors && errors.password ? errors.password[0] : ''"
        />
    </div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Confirm password"
            v-model:input="confirmPassword"
            inputType="password"
            :error="errors && errors.confirmPassword ? errors.confirmPassword[0] : ''"
        />
    </div>
    <div class="px-6 text-[12px] text-gray-600">Forgot password?</div>

    <!-- General Error Display -->
    <div v-if="errors && errors.general" class="px-6 pb-2">
        <div class="text-red-600 text-sm">{{ errors.general[0] }}</div>
    </div>

    <div class="px-6 pb-2 mt-6">
        <button 
            :disabled="(!name || !email || !password || !confirmPassword || isLoading)"
            :class="(!name || !email || !password || !confirmPassword || isLoading) ? 'bg-gray-200' : 'bg-[#3B82F6]'"
            @click="register()" 
            class="w-full text-[17px] font-semibold text-white py-3 rounded-sm"
        >
            <span v-if="!isLoading">Sign up</span>
            <span v-else>Creating account...</span>
        </button>
    </div>
</template>

<script setup>
const { $userStore, $generalStore } = useNuxtApp()

let name = ref('')
let email = ref('')
let password = ref('')
let confirmPassword = ref('')
let errors = ref(null)
let isLoading = ref(false)

const register = async () => {
    errors.value = null
    isLoading.value = true

    try {
        console.log('Starting registration process...')
        
        // Get CSRF token
        await $userStore.getTokens()
        console.log('CSRF token obtained')
        
        // Small delay to ensure token is set
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Attempt registration
        await $userStore.register(
            name.value, 
            email.value, 
            password.value, 
            confirmPassword.value
        )
        console.log('Registration successful')
        
        // Get user data
        await $userStore.getUser()
        console.log('User data retrieved:', $userStore.id, $userStore.name)
        
        // Get random users
        await $generalStore.getRandomUsers('suggested')
        await $generalStore.getRandomUsers('following')
        
        // Close login modal
        $generalStore.isLoginOpen = false
        
        // Force UI refresh
        window.location.reload()
        
    } catch (error) {
        console.error('Registration error:', error)
        
        // Safely handle errors
        if (error.response && error.response.data && error.response.data.errors) {
            errors.value = error.response.data.errors
        } else if (error.message) {
            errors.value = { general: [error.message] }
        } else {
            errors.value = { general: ['Registration failed. Please try again.'] }
        }
    } finally {
        isLoading.value = false
    }
}
</script>