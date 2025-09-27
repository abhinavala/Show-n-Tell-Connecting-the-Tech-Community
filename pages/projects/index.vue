<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-3xl font-bold text-gray-900">All Projects</h1>
          <p class="mt-2 text-gray-600">Browse and discover amazing projects from the community</p>
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
                placeholder="Search projects by title, description, or technology..."
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
          
          <!-- Status Filter -->
          <div class="w-full md:w-48">
            <select
              v-model="selectedStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option v-for="status in statuses" :key="status" :value="status">
                {{ status }}
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
              <option value="views">Most Views</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Projects Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="filteredProjects.length === 0" class="text-center text-gray-500 py-12">
        <Icon name="mdi:folder-open" size="48" class="mx-auto mb-4 text-gray-300"/>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
        <p class="text-gray-600">Try adjusting your search criteria or browse all projects.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          @click="viewProject(project)"
        >
          <!-- Project Video/Image -->
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
            
            <!-- Project Status Badge -->
            <div class="absolute top-3 right-3">
              <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                {{ project.status }}
              </span>
            </div>
          </div>
          
          <!-- Project Info -->
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{{ project.title }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ project.description }}</p>
            
            <!-- Project Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-if="project.category" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {{ project.category }}
              </span>
              <span v-if="project.techStack" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {{ project.techStack }}
              </span>
              <span v-if="project.collaboration" class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                {{ project.collaboration }}
              </span>
            </div>
            
            <!-- Project Stats -->
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div class="flex items-center space-x-4">
                <span class="flex items-center space-x-1">
                  <Icon name="mdi:eye" size="16"/>
                  <span>{{ project.views || 0 }}</span>
                </span>
                <span class="flex items-center space-x-1">
                  <Icon name="mdi:heart" size="16"/>
                  <span>{{ project.likes?.length || 0 }}</span>
                </span>
                <span class="flex items-center space-x-1">
                  <Icon name="mdi:handshake" size="16"/>
                  <span>{{ project.collaborations || 0 }}</span>
                </span>
              </div>
              <span class="text-xs">{{ formatDate(project.created_at) }}</span>
            </div>
            
            <!-- Author Info -->
            <div class="flex items-center space-x-3 pt-4 border-t border-gray-100">
              <img :src="project.user.image" class="w-8 h-8 rounded-full"/>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ project.user.name }}</p>
                <p class="text-xs text-gray-500">{{ project.user.specialty || 'Developer' }}</p>
              </div>
              <button
                @click.stop="followUser(project.user.id)"
                class="px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
              >
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Load More Button -->
      <div v-if="hasMoreProjects" class="text-center mt-8">
        <button
          @click="loadMoreProjects"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Load More Projects
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const sortBy = ref('recent')

const categories = [
  'Web Development', 'Mobile Apps', 'AI/ML', 'Game Development',
  'Data Science', 'DevOps', 'UI/UX Design', 'Blockchain',
  'IoT', 'Cybersecurity', 'Cloud Computing', 'Mobile Games'
]

const statuses = [
  'Planning', 'In Development', 'Beta Testing', 'Live', 'Maintenance'
]

const projects = ref([
  {
    id: 1,
    title: 'AI-Powered Code Review System',
    description: 'An intelligent system that automatically reviews code and suggests improvements using machine learning algorithms.',
    video: null,
    status: 'In Development',
    category: 'AI/ML',
    techStack: 'Python, TensorFlow',
    collaboration: 'Open for Collaboration',
    views: 156,
    likes: [{ user_id: 1 }, { user_id: 2 }],
    collaborations: 3,
    created_at: new Date(Date.now() - 86400000),
    user: {
      id: 1,
      name: 'Sarah Chen',
      image: 'https://via.placeholder.com/32x32',
      specialty: 'AI Engineer'
    }
  },
  {
    id: 2,
    title: 'Mobile Fitness Tracker App',
    description: 'Cross-platform mobile application for tracking workouts, nutrition, and health metrics with social features.',
    video: null,
    status: 'Live',
    category: 'Mobile Apps',
    techStack: 'Flutter, Firebase',
    collaboration: 'Looking for Contributors',
    views: 89,
    likes: [{ user_id: 1 }],
    collaborations: 1,
    created_at: new Date(Date.now() - 172800000),
    user: {
      id: 2,
      name: 'Mike Johnson',
      image: 'https://via.placeholder.com/32x32',
      specialty: 'Mobile Developer'
    }
  },
  {
    id: 3,
    title: 'Blockchain Voting Platform',
    description: 'Secure and transparent voting system built on blockchain technology for organizations and elections.',
    video: null,
    status: 'Beta Testing',
    category: 'Blockchain',
    techStack: 'Solidity, Web3.js',
    collaboration: 'Open Source',
    views: 234,
    likes: [{ user_id: 1 }, { user_id: 2 }, { user_id: 3 }],
    collaborations: 5,
    created_at: new Date(Date.now() - 259200000),
    user: {
      id: 3,
      name: 'Alex Rodriguez',
      image: 'https://via.placeholder.com/32x32',
      specialty: 'Blockchain Developer'
    }
  },
  {
    id: 4,
    title: 'Real-time Chat Application',
    description: 'Modern chat application with real-time messaging, file sharing, and video calling capabilities.',
    video: null,
    status: 'Live',
    category: 'Web Development',
    techStack: 'React, Node.js, Socket.io',
    collaboration: 'Open for Collaboration',
    views: 67,
    likes: [{ user_id: 2 }],
    collaborations: 2,
    created_at: new Date(Date.now() - 345600000),
    user: {
      id: 4,
      name: 'Emily Davis',
      image: 'https://via.placeholder.com/32x32',
      specialty: 'Full Stack Developer'
    }
  },
  {
    id: 5,
    title: 'Machine Learning Dashboard',
    description: 'Interactive dashboard for visualizing and analyzing machine learning model performance and data.',
    video: null,
    status: 'Planning',
    category: 'Data Science',
    techStack: 'Python, Plotly, Dash',
    collaboration: 'Seeking ML Engineers',
    views: 45,
    likes: [],
    collaborations: 0,
    created_at: new Date(Date.now() - 432000000),
    user: {
      id: 5,
      name: 'David Kim',
      image: 'https://via.placeholder.com/32x32',
      specialty: 'Data Scientist'
    }
  },
  {
    id: 6,
    title: 'Mobile Game: Space Explorer',
    description: '2D space exploration game with procedurally generated worlds and engaging gameplay mechanics.',
    video: null,
    status: 'In Development',
    category: 'Game Development',
    techStack: 'Unity, C#',
    collaboration: 'Looking for Artists',
    views: 123,
    likes: [{ user_id: 1 }, { user_id: 3 }],
    collaborations: 1,
    created_at: new Date(Date.now() - 518400000),
    user: {
      id: 6,
      name: 'Lisa Wang',
      image: 'https://via.placeholder.com/32x32',
      specialty: 'Game Developer'
    }
  }
])

const hasMoreProjects = ref(true)

const filteredProjects = computed(() => {
  let filtered = projects.value
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(project => 
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.techStack.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query)
    )
  }
  
  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(project => project.category === selectedCategory.value)
  }
  
  // Status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(project => project.status === selectedStatus.value)
  }
  
  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'recent':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'popular':
        return (b.likes?.length || 0) - (a.likes?.length || 0)
      case 'trending':
        return b.views - a.views
      case 'collaborators':
        return b.collaborations - a.collaborations
      case 'views':
        return b.views - a.views
      default:
        return 0
    }
  })
  
  return filtered
})

const viewProject = (project) => {
  router.push(`/post/${project.id}`)
}

const followUser = (userId) => {
  // TODO: Implement follow functionality
  console.log('Following user:', userId)
}

const loadMoreProjects = () => {
  // TODO: Implement pagination
  console.log('Loading more projects...')
}

const formatDate = (date) => {
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / 86400000)
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}
</script> 