import axiosInstance from './axios';

export const allUsers = async () => {
    try {
        const response = await axiosInstance.get('manager/all-users/');
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}
