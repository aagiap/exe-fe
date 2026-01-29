// src/api/api.js
import axios from "axios";
const api = axios.create({
    baseURL: "https://exe-be-9wd4.onrender.com/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
