import axios from "axios"

export default defineNuxtPlugin((NuxtApp) => {

    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:8000'
    
    // Ensure CSRF token is included in requests
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    
    // Set proper headers for CORS
    axios.defaults.headers.common['Accept'] = 'application/json'
    // REMOVED: Don't set fixed Content-Type - let browser set it automatically for FormData
    
    // Add request interceptor to include CSRF token
    axios.interceptors.request.use(function (config) {
        // Get CSRF token from cookies if available
        const token = getCookie('XSRF-TOKEN')
        if (token) {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
        }
        
        return config;
    }, function (error) {
        return Promise.reject(error);
    });
    
    // Add response interceptor to log responses
    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        console.error('Response error:', error.response?.status, error.response?.data)
        return Promise.reject(error);
    });

    // Helper function to get cookie value
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    return {
        provide: { 
            axios: axios,
        },
    }
})