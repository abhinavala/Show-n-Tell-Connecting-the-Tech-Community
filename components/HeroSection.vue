<template>
    <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 mb-8">
        <div class="text-center">
            <div class="flex items-center justify-center mb-4">
                <Icon name="mdi:code-braces" size="48" color="#3B82F6" class="mr-3"/>
                <h1 class="text-4xl font-bold text-gray-900">Show n Tell</h1>
            </div>
            
            <p class="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                The platform for developers to showcase projects, find collaborators, and share open source code with the community.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <NuxtLink 
                    to="/upload"
                    class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                    <Icon name="mdi:plus" size="20" class="mr-2"/>
                    Showcase Your Project
                </NuxtLink>
                
                <NuxtLink 
                    to="/projects"
                    class="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                >
                    <Icon name="mdi:search" size="20" class="mr-2"/>
                    Discover Projects
                </NuxtLink>
            </div>
        </div>
        
        <!-- Feature Highlights -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div class="text-center">
                <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="mdi:code-braces" size="24" color="#3B82F6"/>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">Showcase Projects</h3>
                <p class="text-sm text-gray-600">Upload demo videos and share your code with the developer community</p>
            </div>
            
            <div class="text-center">
                <div class="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="mdi:handshake" size="24" color="#10B981"/>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">Find Collaborators</h3>
                <p class="text-sm text-gray-600">Connect with developers who want to contribute to your projects</p>
            </div>
            
            <div class="text-center">
                <div class="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="mdi:source-fork" size="24" color="#8B5CF6"/>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">Open Source</h3>
                <p class="text-sm text-gray-600">Discover and use open source code for your own projects</p>
            </div>
        </div>
    </div>
</template>

<script setup>
// No additional logic needed for this component
</script> 