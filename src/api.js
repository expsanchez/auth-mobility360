import axios from 'axios';
import { getToken, login } from './authService';

const api = axios.create({
    // baseURL: 'AQUI_PONDREMOS_LA_URL_DE_TU_NUEVA_API', 
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor de request: agrega automáticamente el token
api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de response: redirige al login si el token expiró
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            console.warn('Token expirado o inválido, redirigiendo al login...');
            login();
        }
        return Promise.reject(err);
    },
);


export default api;
