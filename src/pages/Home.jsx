import { useEffect, useState } from 'react';
import { Container, Typography, Button, CircularProgress, Box, Alert } from '@mui/material';
import { getUser, login, logout } from '../authService';

const Home = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('[Home] Verificando sesión...');

        getUser().then((u) => {
            console.log('[Home] Usuario obtenido:', u);

            if (u && !u.expired) {
                console.log('[Home] Usuario válido, mostrando app');
                setUser(u);
                setLoading(false);
            } else {
                console.log('[Home] No hay usuario o expiró, redirigiendo al login...');
                login().catch((err) => {
                    // Si signinRedirect falla (ej: CORS, no se puede alcanzar .well-known)
                    console.error('[Home] Error al redirigir al login:', err);
                    setError(err?.message || String(err));
                    setLoading(false);
                });
            }
        }).catch((err) => {
            console.error('[Home] Error al obtener usuario:', err);
            setError(err?.message || String(err));
            setLoading(false);
        });
    }, []);

    if (error) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2, p: 3 }}>
                <Alert severity="error" sx={{ maxWidth: 600, width: '100%' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Error de conexión</Typography>
                    <Typography variant="body2" sx={{ mt: 1, wordBreak: 'break-all' }}>{error}</Typography>
                </Alert>
                <Typography variant="body2" color="text.secondary">
                    Verifica que el servidor de autenticación esté corriendo y accesible.
                </Typography>
                <Button variant="contained" onClick={() => {
                    sessionStorage.clear();
                    window.location.reload();
                }}>
                    Reintentar
                </Button>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Redirigiendo al login...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Bienvenido {user?.profile?.name || 'Usuario'} 🚀
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Has iniciado sesión correctamente.
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Token: {user?.access_token?.substring(0, 20)}...
            </Typography>
            <Button variant="contained" color="error" onClick={logout} sx={{ mt: 2 }}>
                Cerrar sesión
            </Button>
        </Container>
    );
};

export default Home;
