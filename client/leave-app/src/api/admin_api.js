import axiosInstance from './axios';

export const allUsers = async () => {
    try {
        const response = await axiosInstance.get('manager/all-users/');
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const toggleUserStatus = async (userId) => {
    try {
        const response = await axiosInstance.put(`manager/users/${userId}/status/`);
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const createUser = async (userData) => {
    try {
        const response = await axiosInstance.post(`manager/users/create/`,userData);
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const getAllLeaves = async () => {
    try {
        const response = await axiosInstance.get(`manager/leaves/`);
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const toggleLeaveStatus = async (userId,data) => {
    try {
        const response = await axiosInstance.put(`manager/leave/${userId}/status/`,data);
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


