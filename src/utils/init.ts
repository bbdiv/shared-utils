import createPersistor from "../persistor";
import { useAuthStore } from "../store/auth";
import type { AuthData } from "../store/auth";

const initAuth = async () => {
	const persistor = createPersistor<AuthData>("indexedDB");
	const authData = await persistor.get("authData");

	function isValidAuthData(data: any): data is AuthData {
		return (
			typeof data === "object" &&
			typeof data.accessToken === "string" &&
			typeof data.expiresIn === "number" &&
			typeof data.idToken === "string" &&
			typeof data.refreshToken === "string"
		);
	}

	if (authData && isValidAuthData(authData)) {
		useAuthStore.getState().setAuth(authData);
	}
};

const initLoggedUser = async () => {
}


const init = async () => {
	await initAuth();
    await initLoggedUser();
};

export default init;
export { initAuth };