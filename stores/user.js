import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import { useGeneralStore } from './general'

const $axios = axios().provide.axios

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    name: '',
    bio: '',
    image: ''
  }),
  actions: {

    async getTokens() {
      await $axios.get('/sanctum/csrf-cookie')
    },

    async login(email, password) {
      try {
        console.log('Attempting login with:', email)
        
        const response = await $axios.post('/login', {
          email: email,
          password: password
        })
        
        console.log('Login response:', response)
        
        // Wait a moment for cookies to be set
        await new Promise(resolve => setTimeout(resolve, 100))
        
        return response
      } catch (error) {
        console.error('Login error in store:', error)
        throw error
      }
    },

    async register(name, email, password, confirmPassword) {
      await $axios.post('/register', {
        name: name,
        email: email,
        password: password,
        password_confirmation: confirmPassword
      })
    },

    async testApiConnection() {
      try {
        console.log('Testing API connection...')
        
        // Test basic connection
        const testResponse = await $axios.get('/')
        console.log('Basic connection test:', testResponse.status)
        
        // Test CSRF endpoint
        const csrfResponse = await $axios.get('/sanctum/csrf-cookie')
        console.log('CSRF endpoint test:', csrfResponse.status)
        
        // Test if we're already logged in
        try {
          const userResponse = await $axios.get('/api/logged-in-user')
          console.log('User endpoint test:', userResponse.status, userResponse.data)
        } catch (userError) {
          console.log('User endpoint error (expected if not logged in):', userError.response?.status)
        }
        
        return true
      } catch (error) {
        console.error('API connection test failed:', error)
        return false
      }
    },

    async checkAuthStatus() {
      try {
        console.log('Checking authentication status...')
        const response = await $axios.get('/api/logged-in-user')
        console.log('Auth check response:', response)
        
        if (response.data && response.data[0]) {
          this.id = response.data[0].id
          this.name = response.data[0].name
          this.bio = response.data[0].bio
          this.image = response.data[0].image
          return true
        }
        return false
      } catch (error) {
        console.log('User not authenticated:', error.response?.status)
        return false
      }
    },

    async getUser() {
      try {
        console.log('Fetching user data...')
        let res = await $axios.get('/api/logged-in-user')
        console.log('User API response:', res)
        
        if (!res || !res.data) {
          console.error('No response data received')
          throw new Error('No user data received')
        }
        
        if (!res.data[0]) {
          console.error('User data structure unexpected:', res.data)
          throw new Error('User data structure unexpected')
        }
        
        this.id = res.data[0].id
        this.name = res.data[0].name
        this.bio = res.data[0].bio
        this.image = res.data[0].image
        
        console.log('User data set successfully:', {
          id: this.id,
          name: this.name,
          bio: this.bio,
          image: this.image
        })
        
        return res.data[0]
      } catch (error) {
        console.error('Error fetching user data:', error)
        throw error
      }
    },

    async updateUserImage(data) {
      return await $axios.post('/api/update-user-image', data)
    },

    async updateUser(name, bio) {
      return await $axios.patch('/api/update-user', {
        name: name,
        bio: bio
      })
    },

    async createPost(data) {
      return await $axios.post('/api/posts', data)
    },

    async deletePost(post) {
      return await $axios.delete(`/api/posts/${post.id}`)
    },

    async addComment(post, comment) {
      let res = await $axios.post('/api/comments', {
        post_id: post.id,
        comment: comment
      })

      if (res.status === 200) {
        await this.updateComments(post)
      }
    },

    async deleteComment(post, commentId) {
      let res = await $axios.delete(`/api/comments/${commentId}`, {
        post_id: post.id
      })

      if (res.status === 200) {
        await this.updateComments(post)
      }
    },

    async updateComments(post) {
      let res = await $axios.get(`/api/profiles/${post.user.id}`)

      for (let i = 0; i < res.data.posts.length; i++) {
          const updatePost = res.data.posts[i];

          if (post.id == updatePost.id) {
              useGeneralStore().selectedPost.comments = updatePost.comments
          }
      }
    },

    async likePost(post, isPostPage) {
      let res = await $axios.post('/api/likes', {
        post_id: post.id,
      })

      console.log(res)

      let singlePost = null

      if (isPostPage) {
        singlePost = post
      } else {
        singlePost = useGeneralStore().posts.find(p => p.id === post.id)
      }
      console.log(singlePost)
      singlePost.likes.push(res.data.like)
    },

    async unlikePost(post, isPostPage) {
      let deleteLike = null
      let singlePost = null

      if (isPostPage) {
        singlePost = post
      } else {
        singlePost = useGeneralStore().posts.find(p => p.id === post.id)
      }

      singlePost.likes.forEach(like => {
        if (like.user_id === this.id) { deleteLike = like }
      });
      
      let res = await $axios.delete('/api/likes/' + deleteLike.id)

      for (let i = 0; i < singlePost.likes.length; i++) {
        const like = singlePost.likes[i];
        if (like.id === res.data.like.id) { singlePost.likes.splice(i, 1); }
      }
    },

    async logout() {
      await $axios.post('/logout')
      this.resetUser()
    },

    resetUser() {      
      this.id = ''
      this.name = ''
      this.bio = ''
      this.image = ''
    }

  },
  persist: true,
})
