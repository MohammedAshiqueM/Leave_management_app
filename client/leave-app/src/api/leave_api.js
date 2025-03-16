import axiosInstance from "./axios";

export const createLeave = async (leaveData) => {
    try {
        const response = await axiosInstance.post('employee/leave/',leaveData);
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const getIUserLeaves = async () => {
    try{
        const response = await axiosInstance.get('employee/leave/')
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error.message
    }
}