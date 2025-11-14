import { useAuthStore, type AuthData } from "../store/auth";
import { setCookie } from "./cookies";

/**
 * Salva os tokens de autenticação na store Auth e nos cookies do navegador.
 *
 * @param {AuthData} authData - Objeto contendo os tokens de autenticação (accessToken, refreshToken, idToken).
 */
export const saveAuth = (authData : AuthData) => {

    //salva os tokens na store Auth
    useAuthStore.getState().setAuth(authData);

    //salva os tokens nos cookies
    const domain = window.location.hostname;
    
    setCookie('accessToken', authData.accessToken, 1, domain);
    //salva o refreshToken por 30 dias e o idToken por 1 dia
    setCookie('refreshToken', authData.refreshToken, 30, domain);
    setCookie('idToken', authData.idToken, 1, domain);
}