import axiosInstance from './axios';

export const refreshTokens = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await axiosInstance.post('employee/token/refresh/', {
            refresh: refreshToken,
        });

        // Update the access token in localStorage
        localStorage.setItem('access', response.data.access);

        return response.data.access; // Return the new access token
    } catch (error) {
        console.error('Error refreshing tokens:', error);
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axiosInstance.post(`employee/token/`, userData);
        
        const { access, refresh } = response.data;

        // Store tokens in localStorage
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const userProfile = async () => {
    try {
        const response = await axiosInstance.get('employee/profile/');
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const userLogout = async () => {
    const refresh = localStorage.getItem('refresh');
    const response = await axiosInstance.post('employee/logout/',{"refresh":refresh});
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    delete axiosInstance.defaults.headers.common['Authorization'];
    // window.location.href = '/login'; // Redirect to login page
};