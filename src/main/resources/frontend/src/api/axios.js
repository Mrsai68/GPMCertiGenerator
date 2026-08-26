import axios from 'axios';

// Dynamically use current hostname so API calls work seamlessly from mobile devices over Wi-Fi
const isLocal = window.location.hostname === 'localhost' || window.location.hostname;

const baseURL = isLocal ? 'http://localhost:8080' : 'https://gpmcertigenerator.onrender.com';

const api = axios.create({
    baseURL: baseURL,
});

api.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.accessToken) {
                    config.headers['Authorization'] = `Bearer ${user.accessToken}`;
                }
            } catch (e) {
                console.error('Error parsing stored user', e);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
