import api from './api';
import { IdentityUrl } from './config';

// Usamos axios interceptor para que el token se envíe automáticamente

/**
 * Obtiene los recursos para el usuario
 */
export const fetchRecursos = async () => {
    const response = await api.get(`${IdentityUrl}/api/v1/account/recursos`);
    return response.data;
};

/**
 * Obtiene el árbol de opciones / menú del usuario
 */
export const fetchOpciones = async () => {
    const response = await api.get(`${IdentityUrl}/api/v1/account/opciones`);
    return response.data;
};
