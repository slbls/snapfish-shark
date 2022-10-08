const sessionStorageKey =
	process.env.VITE_SNAPFISH_AUTHENTICATION_SESSION_STORAGE_KEY;

export const isSnapfishAuthenticated = () =>
	sessionStorage.getItem(sessionStorageKey) === "true";

export const mockSnapfishAuthentication = () => {
	sessionStorage.setItem(sessionStorageKey, "true");
	return () => sessionStorage.removeItem(sessionStorageKey);
};
