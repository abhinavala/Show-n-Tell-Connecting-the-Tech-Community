<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div @click="closeModal" class="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b">
                <div class="flex items-center">
                    <span class="text-xl mr-2">💬</span>
                    <h3 class="text-lg font-semibold">Project Comments</h3>
                </div>
                <button
                    @click="$emit('close')"
                    class="text-gray-400 hover:text-gray-600 p-1"
                >
                    <span class="text-xl">✕</span>
                </button>
            </div>
            
            <!-- Project Info -->
            <div v-if="project" class="p-4 border-b bg-blue-50">
                <div class="text-sm font-medium text-gray-900">{{ project.title }}</div>
                <div class="text-xs text-gray-600">by {{ project.user?.name }}</div>
            </div>
            
            <!-- Comments Section -->
            <div class="flex-1 overflow-y-auto max-h-96">
                <!-- No Comments Message -->
                <div v-if="!comments || comments.length === 0" class="text-center text-gray-500 py-8">
                  <span class="text-4xl mb-2 text-gray-300">💬</span>
                  <p>No comments yet. Be the first to comment!</p>
                </div>
                
                <div v-else class="p-4 space-y-4">
                    <div 
                        v-for="comment in comments" 
                        :key="comment.id"
                        class="flex space-x-3"
                    >
                        <!-- User Avatar -->
                        <div class="flex-shrink-0">
                            <img 
                                :src="comment.userAvatar || 'https://via.placeholder.com/32x32'"
                                class="w-8 h-8 rounded-full"
                                alt="User avatar"
                            />
                        </div>
                        
                        <!-- Comment Content -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center space-x-2 mb-1">
                                <span class="text-sm font-semibold text-gray-900">{{ comment.userName }}</span>
                                <span class="text-xs text-gray-500">{{ formatTime(comment.timestamp) }}</span>
                            </div>
                            
                            <p class="text-sm text-gray-800 mb-2">{{ comment.text }}</p>
                            
                            <!-- Comment Actions -->
                            <div class="flex items-center space-x-4 text-xs text-gray-500">
                                <button 
                                    @click="likeComment(comment)"
                                    class="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                                >
                                    <span>{{ comment.likes }}</span>
                                </button>
                                
                                <button 
                                    @click="showReplyInput(comment)"
                                    class="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                                >
                                    <span>Reply</span>
                                </button>
                                
                                <button 
                                    @click="shareComment(comment)"
                                    class="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                                >
                                    <span>Share</span>
                                </button>
                            </div>
                            
                            <!-- Reply Input (Hidden by default) -->
                            <div v-if="comment.showReply" class="mt-3">
                                <div class="flex space-x-2">
                                    <input
                                        v-model="comment.replyText"
                                        type="text"
                                        placeholder="Write a reply..."
                                        class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        @click="submitReply(comment)"
                                        :disabled="!comment.replyText.trim()"
                                        class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Replies -->
                            <div v-if="comment.replies && comment.replies.length > 0" class="mt-3 ml-4 space-y-3">
                                <div 
                                    v-for="reply in comment.replies" 
                                    :key="reply.id"
                                    class="flex space-x-2"
                                >
                                    <img 
                                        :src="reply.userAvatar || 'https://via.placeholder.com/24x24'"
                                        class="w-6 h-6 rounded-full"
                                        alt="User avatar"
                                    />
                                    <div class="flex-1">
                                        <div class="flex items-center space-x-2 mb-1">
                                            <span class="text-xs font-semibold text-gray-900">{{ reply.userName }}</span>
                                            <span class="text-xs text-gray-500">{{ formatTime(reply.timestamp) }}</span>
                                        </div>
                                        <p class="text-xs text-gray-800">{{ reply.text }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Comment Input -->
            <div class="p-4 border-t bg-gray-50">
                <div class="flex space-x-2">
                    <img 
                        :src="$userStore?.image || 'https://via.placeholder.com/32x32'"
                        class="w-8 h-8 rounded-full flex-shrink-0"
                        alt="Your avatar"
                    />
                    <div class="flex-1 flex space-x-2">
                        <input
                            v-model="newComment"
                            @keyup.enter="submitComment"
                            type="text"
                            placeholder="Add a comment..."
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            @click="submitComment"
                            :disabled="!newComment.trim()"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    project: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close'])

const { $userStore } = useNuxtApp()

const newComment = ref('')
const comments = ref([
    // Sample comments for demonstration
    {
        id: 1,
        userId: 1,
        userName: 'John Doe',
        userAvatar: 'https://via.placeholder.com/32x32',
        text: 'This project looks amazing! I\'d love to collaborate on the frontend.',
        timestamp: new Date(Date.now() - 3600000),
        likes: 5,
        isLiked: false,
        showReply: false,
        replyText: '',
        replies: [
            {
                id: 11,
                userId: 2,
                userName: 'Jane Smith',
                userAvatar: 'https://via.placeholder.com/24x24',
                text: 'I agree! The UI is really clean.',
                timestamp: new Date(Date.now() - 1800000)
            }
        ]
    },
    {
        id: 2,
        userId: 2,
        userName: 'Jane Smith',
        userAvatar: 'https://via.placeholder.com/32x32',
        text: 'What tech stack are you using for this?',
        timestamp: new Date(Date.now() - 1800000),
        likes: 3,
        isLiked: true,
        showReply: false,
        replyText: '',
        replies: []
    },
    {
        id: 3,
        userId: 3,
        userName: 'Mike Johnson',
        userAvatar: 'https://via.placeholder.com/32x32',
        text: 'Great work! This could really help the open source community.',
        timestamp: new Date(Date.now() - 900000),
        likes: 7,
        isLiked: false,
        showReply: false,
        replyText: '',
        replies: []
    }
])

const closeModal = () => {
    emit('close')
    newComment.value = ''
}

const submitComment = () => {
    if (!newComment.value.trim()) return
    
    const comment = {
        id: Date.now(),
        userId: $userStore.id,
        userName: $userStore.name,
        userAvatar: $userStore.image,
        text: newComment.value.trim(),
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
        showReply: false,
        replyText: '',
        replies: []
    }
    
    comments.value.unshift(comment)
    newComment.value = ''
    
    // TODO: Send comment to backend
    console.log('New comment:', comment)
}

const likeComment = (comment) => {
    if (comment.isLiked) {
        comment.likes--
        comment.isLiked = false
    } else {
        comment.likes++
        comment.isLiked = true
    }
    
    // TODO: Send like to backend
    console.log('Comment liked:', comment.id)
}

const showReplyInput = (comment) => {
    comment.showReply = !comment.showReply
    if (comment.showReply) {
        comment.replyText = ''
    }
}

const submitReply = (comment) => {
    if (!comment.replyText.trim()) return
    
    const reply = {
        id: Date.now(),
        userId: $userStore.id,
        userName: $userStore.name,
        userAvatar: $userStore.image,
        text: comment.replyText.trim(),
        timestamp: new Date()
    }
    
    if (!comment.replies) {
        comment.replies = []
    }
    
    comment.replies.push(reply)
    comment.showReply = false
    comment.replyText = ''
    
    // TODO: Send reply to backend
    console.log('New reply:', reply)
}

const shareComment = (comment) => {
    // TODO: Implement comment sharing
    console.log('Sharing comment:', comment.id)
    alert('Comment sharing feature coming soon!')
}

const formatTime = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}
</script> 