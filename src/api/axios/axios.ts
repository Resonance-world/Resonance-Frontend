import axios from "axios";

export const AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'ngrok-skip-browser-warning': 'true',
    },
})

// Debug: Log the base URL being used
console.log('🔗 Frontend using backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050');

AxiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'



