import axios from 'axios';

const token = localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Authorization: token ? `Bearer ${token}` : '',
    },
    // headers: {
    //     'Content-Type': 'application/json',
    //     ...(token && { Authorization: `Bearer ${token}` })
    // }
});

export default axiosInstance;
