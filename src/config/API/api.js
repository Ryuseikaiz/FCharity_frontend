import axios from "axios";

// 📌 Sử dụng biến môi trường để lấy URL API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/";

export const API = axios.create({
    baseURL: API_BASE_URL,
});

export const APIPrivate = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// ✅ Get state dynamically inside interceptor
APIPrivate.interceptors.request.use(
    async (config) => {

        const token = localStorage.getItem("token");
        console.log("Token before request: ", token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

APIPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 403) {
            const refreshToken = localStorage.getItem("refreshToken");
            const response = await API.post("auth/refresh", { refreshToken });
            console.log("Refresh token response: ", response);
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                error.config.headers["Authorization"] = `Bearer ${response.data.token}`;
                return APIPrivate.request(error.config);
            }
        }
        return Promise.reject(error);
    }
);




