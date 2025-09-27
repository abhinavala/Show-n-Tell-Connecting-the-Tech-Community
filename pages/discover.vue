<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-3xl font-bold text-gray-900">Discover</h1>
          <p class="mt-2 text-gray-600">Find amazing projects and talented developers</p>
        </div>
      </div>
    </div>
    
    <!-- Search and Filters -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search Bar -->
          <div class="flex-1">
            <div class="relative">
              <Icon name="mdi:magnify" size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search projects, developers, or technologies..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <!-- Category Filter -->
          <div class="w-full md:w-48">
            <select
              v-model="selectedCategory"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <!-- Sort By -->
          <div class="w-full md:w-48">
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
              <option value="collaborators">Most Collaborators</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Featured Projects -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="project in featuredProjects"
            :key="project.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            @click="viewProject(project)"
          >
            <div class="h-48 bg-gray-200 relative">
              <video
                v-if="project.video"
                :src="project.video"
                class="w-full h-full object-cover"
                muted
                loop
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="mdi:video-off" size="48" class="text-gray-400"/>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ project.title }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ project.description }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <img :src="project.user.image" class="w-6 h-6 rounded-full"/>
                  <span class="text-sm text-gray-600">{{ project.user.name }}</span>
                </div>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {{ project.category }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Trending Technologies -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Trending Technologies</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="tech in trendingTechs"
            :key="tech.name"
            class="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
            @click="searchByTech(tech.name)"
          >
            <Icon :name="tech.icon" size="32" class="mx-auto mb-2 text-blue-600"/>
            <p class="text-sm font-medium text-gray-900">{{ tech.name }}</p>
            <p class="text-xs text-gray-500">{{ tech.count }} projects</p>
          </div>
        </div>
      </div>
      
      <!-- Top Developers -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Top Developers</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="developer in topDevelopers"
            :key="developer.id"
            class="bg-white rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            @click="viewProfile(developer.id)"
          >
            <div class="flex items-center space-x-4">
              <img :src="developer.image" class="w-16 h-16 rounded-full"/>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ developer.name }}</h3>
                <p class="text-gray-600 text-sm">{{ developer.specialty }}</p>
                <div class="flex items-center space-x-2 mt-2">
                  <Icon name="mdi:star" size="16" class="text-yellow-400"/>
                  <span class="text-sm text-gray-600">{{ developer.rating }}/5</span>
                  <span class="text-sm text-gray-500">({{ developer.reviews }} reviews)</span>
                </div>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="skill in developer.skills"
                :key="skill"
                class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
            @click="handleActivityClick(activity)"
          >
            <div class="flex items-center space-x-3">
              <img :src="activity.user.image" class="w-10 h-10 rounded-full"/>
              <div class="flex-1">
                <p class="text-sm text-gray-900">
                  <span class="font-medium">{{ activity.user.name }}</span>
                  {{ activity.action }}
                  <span v-if="activity.project" class="font-medium text-blue-600">
                    {{ activity.project.title }}
                  </span>
                </p>
                <p class="text-xs text-gray-500">{{ formatTime(activity.timestamp) }}</p>
              </div>
              <Icon :name="getActivityIcon(activity.type)" size="20" class="text-gray-400"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('recent')

const categories = [
  'Web Development', 'Mobile Apps', 'AI/ML', 'Game Development',
  'Data Science', 'DevOps', 'UI/UX Design', 'Blockchain',
  'IoT', 'Cybersecurity', 'Cloud Computing', 'Mobile Games'
]

const featuredProjects = ref([
  {
    id: 1,
    title: 'AI-Powered Code Review',
    description: 'An intelligent system that automatically reviews code and suggests improvements using machine learning.',
    video: null,
    category: 'AI/ML',
    user: { name: 'Sarah Chen', image: 'https://via.placeholder.com/32x32' }
  },
  {
    id: 2,
    title: 'Mobile Fitness Tracker',
    description: 'Cross-platform mobile app for tracking workouts, nutrition, and health metrics with social features.',
    video: null,
    category: 'Mobile Apps',
    user: { name: 'Mike Johnson', image: 'https://via.placeholder.com/32x32' }
  },
  {
    id: 3,
    title: 'Blockchain Voting System',
    description: 'Secure and transparent voting platform built on blockchain technology for organizations and elections.',
    video: null,
    category: 'Blockchain',
    user: { name: 'Alex Rodriguez', image: 'https://via.placeholder.com/32x32' }
  }
])

const trendingTechs = ref([
  { name: 'React', icon: 'mdi:react', count: 156 },
  { name: 'Python', icon: 'mdi:language-python', count: 234 },
  { name: 'Flutter', icon: 'mdi:flutter', count: 89 },
  { name: 'Node.js', icon: 'mdi:nodejs', count: 178 },
  { name: 'TensorFlow', icon: 'mdi:brain', count: 67 },
  { name: 'Docker', icon: 'mdi:docker', count: 123 }
])

const topDevelopers = ref([
  {
    id: 1,
    name: 'Sarah Chen',
    image: 'https://via.placeholder.com/64x64',
    specialty: 'Full Stack Developer',
    rating: 4.9,
    reviews: 47,
    skills: ['React', 'Node.js', 'Python', 'AWS']
  },
  {
    id: 2,
    name: 'Mike Johnson',
    image: 'https://via.placeholder.com/64x64',
    specialty: 'Mobile Developer',
    rating: 4.8,
    reviews: 32,
    skills: ['Flutter', 'React Native', 'iOS', 'Android']
  },
  {
    id: 3,
    name: 'Alex Rodriguez',
    image: 'https://via.placeholder.com/64x64',
    specialty: 'AI/ML Engineer',
    rating: 4.9,
    reviews: 28,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps']
  }
])

const recentActivity = ref([
  {
    id: 1,
    user: { name: 'Sarah Chen', image: 'https://via.placeholder.com/40x40' },
    action: 'started collaborating on',
    project: { title: 'AI-Powered Code Review' },
    type: 'collaboration',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: 2,
    user: { name: 'Mike Johnson', image: 'https://via.placeholder.com/40x40' },
    action: 'uploaded a new project',
    project: { title: 'Mobile Fitness Tracker' },
    type: 'upload',
    timestamp: new Date(Date.now() - 7200000)
  },
  {
    id: 3,
    user: { name: 'Alex Rodriguez', image: 'https://via.placeholder.com/40x40' },
    action: 'completed collaboration on',
    project: { title: 'Blockchain Voting System' },
    type: 'completion',
    timestamp: new Date(Date.now() - 86400000)
  }
])

const viewProject = (project) => {
  router.push(`/post/${project.id}`)
}

const searchByTech = (techName) => {
  searchQuery.value = techName
  // TODO: Implement search functionality
}

const viewProfile = (userId) => {
  router.push(`/profile/${userId}`)
}

const handleActivityClick = (activity) => {
  if (activity.project) {
    router.push(`/post/${activity.project.id}`)
  }
}

const getActivityIcon = (type) => {
  const icons = {
    collaboration: 'mdi:handshake',
    upload: 'mdi:upload',
    completion: 'mdi:check-circle'
  }
  return icons[type] || 'mdi:information'
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