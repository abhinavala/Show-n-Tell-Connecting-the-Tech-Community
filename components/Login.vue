<template>
    <div class="text-center text-[28px] mb-4 font-bold">Log in</div>

    <div class="px-6 pb-1.5 text-[15px]">Email address</div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Email address"
            v-model:input="email"
            inputType="email"
            :autoFocus="true"
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
    <div class="px-6 text-[12px] text-gray-600">Forgot password?</div>

    <!-- General Error Display -->
    <div v-if="errors && errors.general" class="px-6 pb-2">
        <div class="text-red-600 text-sm">{{ errors.general[0] }}</div>
    </div>

    <div class="px-6 pb-2 mt-6">
        <button 
            :disabled="(!email || !password || isLoading)"
            :class="(!email || !password || isLoading) ? 'bg-gray-200' : 'bg-[#3B82F6]'"
            @click="login()" 
            class="w-full text-[17px] font-semibold text-white py-3 rounded-sm"
        >
            <span v-if="!isLoading">Log in</span>
            <span v-else>Logging in...</span>
        </button>
    </div>
</template>

<script setup>
const { $userStore, $generalStore } = useNuxtApp()

let email = ref('')
let password = ref('')
let errors = ref(null)
let isLoading = ref(false)

const login = async () => {
    errors.value = null
    isLoading.value = true

    try {
        console.log('=== STARTING LOGIN PROCESS ===')
        
        // Step 1: Get CSRF token
        console.log('Step 1: Getting CSRF token...')
        await $userStore.getTokens()
        console.log('✅ CSRF token obtained')
        
        // Step 2: Attempt login
        console.log('Step 2: Attempting login...')
        const loginResponse = await $userStore.login(email.value, password.value)
        console.log('✅ Login successful:', loginResponse)
        
        // Step 3: Get user data
        console.log('Step 3: Fetching user data...')
        const userData = await $userStore.getUser()
        console.log('✅ User data retrieved:', userData)
        
        // Step 4: Verify user is logged in
        console.log('Step 4: Verifying authentication...')
        if (!$userStore.id) {
            throw new Error('User ID not set after login')
        }
        console.log('✅ User authenticated with ID:', $userStore.id)
        
        // Step 5: Get random users for sidebar
        console.log('Step 5: Loading sidebar data...')
        await $generalStore.getRandomUsers('suggested')
        await $generalStore.getRandomUsers('following')
        console.log('✅ Sidebar data loaded')
        
        // Step 6: Close login modal
        console.log('Step 6: Closing login modal...')
        $generalStore.isLoginOpen = false
        console.log('✅ Login modal closed')
        
        // Step 7: Show success message
        console.log('Step 7: Login complete!')
        
        // Step 8: Redirect or refresh
        setTimeout(() => {
            window.location.reload()
        }, 500)
        
    } catch (error) {
        console.error('❌ LOGIN ERROR:', error)
        
        // Handle specific error types
        if (error.response) {
            // Server responded with error
            if (error.response.status === 401) {
                errors.value = { general: ['Invalid email or password'] }
            } else if (error.response.status === 422) {
                errors.value = error.response.data.errors
            } else if (error.response.status === 419) {
                errors.value = { general: ['Session expired. Please try again.'] }
            } else {
                errors.value = { general: [`Server error: ${error.response.status}`] }
            }
        } else if (error.request) {
            // Request made but no response
            errors.value = { general: ['No response from server. Please check your connection.'] }
        } else {
            // Other error
            errors.value = { general: [error.message || 'Login failed. Please try again.'] }
        }
    } finally {
        isLoading.value = false
    }
}
</script>