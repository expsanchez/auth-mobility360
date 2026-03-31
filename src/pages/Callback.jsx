import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleCallback } from '../authService';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';

const Callback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('[Callback] URL actual:', window.location.href);
        console.log('[Callback] Query params:', window.location.search);

        // Verificar si hay un error en la URL (el auth server puede devolver errores)
        const params = new URLSearchParams(window.location.search);
        if (params.get('error')) {
            const errMsg = `${params.get('error')}: ${params.get('error_description') || 'Sin descripción'}`;
            console.error('[Callback] Error del auth server:', errMsg);
            setError(errMsg);
            return;
        }

        handleCallback()
            .then((user) => {
                console.log('[Callback] Login exitoso:', user);
                navigate('/', { replace: true });
            })
            .catch((err) => {
                console.error('[Callback] Error procesando callback:', err);
                setError(err?.message || String(err));
                // NO redirigir a / automáticamente - esto causaba el loop infinito
            });
    }, [navigate]);

    if (error) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2, p: 3 }}>
                <Alert severity="error" sx={{ maxWidth: 600, width: '100%' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Error de autenticación</Typography>
                    <Typography variant="body2" sx={{ mt: 1, wordBreak: 'break-all' }}>{error}</Typography>
                </Alert>
                <Button variant="contained" onClick={() => {
                    sessionStorage.clear();
                    navigate('/', { replace: true });
                }}>
                    Reintentar
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Procesando login...</Typography>
        </Box>
    );
};

export default Callback;
