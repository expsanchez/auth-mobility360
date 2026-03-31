import { UserManager, WebStorageStateStore, Log } from 'oidc-client-ts';

// Habilitar logs de debug de oidc-client-ts en la consola del navegador
Log.setLogger(console);
Log.setLevel(Log.DEBUG);

const userManager = new UserManager({
    authority: 'https://accounts.mobility360.x-pertec.com',
    client_id: 'SalesMobilityDev',

    redirect_uri: `${window.location.origin}/callback`,
    post_logout_redirect_uri: `${window.location.origin}`,

    response_type: 'code',
    scope: 'openid profile offline_access',

    automaticSilentRenew: false, // Deshabilitado hasta que el flujo básico funcione

    // Almacenar estado en sessionStorage para que PKCE code_verifier persista
    stateStore: new WebStorageStateStore({ store: window.sessionStorage }),
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
});

export const login = () => userManager.signinRedirect();

export const handleCallback = async () => {
    const user = await userManager.signinRedirectCallback();
    return user;
};

export const getUser = async () => {
    return await userManager.getUser();
};

export const getToken = async () => {
    const user = await userManager.getUser();
    return user?.access_token;
};

export const logout = () => userManager.signoutRedirect();
