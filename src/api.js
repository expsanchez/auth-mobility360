import axios from 'axios';
import { getToken, login } from './authService';

const api = axios.create({
    // baseURL: 'https://tu-api.com', // Configura la URL base de tu API aquí
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

// Mantener compatibilidad con setupInterceptor para uso manual
export const setupInterceptor = (getTokenFn) => {
    axios.interceptors.request.use((config) => {
        const token = getTokenFn();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};

export default api;
