import axios from 'axios'
import { baseUrl } from '../constants'
import { refreshTokens } from './auth';
const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// request interceptor to include the access token in headers
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // if the error is due to an expired token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried

            try {
                const newAccessToken = await refreshTokens(); // Refresh the token
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`; // Update the default header
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // Update the original request header
                return axiosInstance(originalRequest); // Retry the original request
            } catch (refreshError) {
                console.error('Unable to refresh token:', refreshError);
                // Redirect to login or handle the error
                window.location.href = '/login'; // Example: Redirect to login page
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;