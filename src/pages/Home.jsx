import { useEffect, useState } from 'react';
import { Container, Typography, Button, CircularProgress, Box, Alert, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { getUser, login, logout } from '../authService';
import { fetchRecursos, fetchOpciones } from '../accountService';
import api from '../api';

const Home = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [opciones, setOpciones] = useState([]);

    useEffect(() => {
        const initData = async () => {
            console.log('[Home] Verificando sesión...');
            try {
                const u = await getUser();
                if (u && !u.expired) {
                    console.log('[Home] Usuario válido, obteniendo recursos...');
                    setUser(u);
                    
                    // Consumimos API 1: Recursos
                    const recursos = await fetchRecursos();
                    if (recursos && recursos.length > 0) {
                        const baseUrl = recursos[0].uriHost;
                        console.log('[Home] URL Base API configurada:', baseUrl);
                        
                        // Configuramos el interceptor para las próximas peticiones
                        api.defaults.baseURL = baseUrl;
                    }
                    
                    // Consumimos API 2: Opciones
                    console.log('[Home] Obteniendo opciones...');
                    const opcionesData = await fetchOpciones();
                    setOpciones(opcionesData || []);
                    
                    setLoading(false);
                } else {
                    console.log('[Home] No hay usuario o expiró, redirigiendo al login...');
                    login().catch((err) => {
                        console.error('[Home] Error al redirigir al login:', err);
                        setError(err?.message || String(err));
                        setLoading(false);
                    });
                }
            } catch (err) {
                console.error('[Home] Error de inicialización:', err);
                setError(err?.message || String(err));
                setLoading(false);
            }
        };

        initData();
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
                <Typography sx={{ ml: 2 }}>Cargando información del usuario...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Bienvenido {user?.profile?.name || 'Usuario'} 🚀
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Has iniciado sesión correctamente. Base URL del nuevo API lista.
            </Typography>
            
            {opciones && opciones.length > 0 && (
                <Box sx={{ mt: 4, mb: 4, textAlign: 'left', backgroundColor: '#f1f5f9', borderRadius: 2, p: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">Módulos Asignados</Typography>
                    <List>
                        {opciones.map(opcion => (
                            <ListItem key={opcion.optionId} sx={{ bgcolor: 'white', mb: 1, borderRadius: 1, border: '1px solid #e2e8f0' }}>
                                <ListItemIcon>
                                    <i className={opcion.iconCls} style={{ fontSize: '20px', color: '#1976d2' }}></i>
                                </ListItemIcon>
                                <ListItemText 
                                    primary={<Typography fontWeight="bold">{opcion.name}</Typography>} 
                                    secondary={`${opcion.children ? opcion.children.length : 0} submódulos - Ruta: ${opcion.path}`} 
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            <Button variant="contained" color="error" onClick={logout} sx={{ mt: 2 }}>
                Cerrar sesión
            </Button>
        </Container>
    );
};

export default Home;
