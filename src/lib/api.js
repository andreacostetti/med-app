import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

export async function getValidToken() {
    try {
        const result = await FirebaseAuthentication.getIdToken({ forceRefresh: true });
        return result.token;
    } catch (error) {
        console.error("Impossibile recuperare il token:", error);
        return null; 
    }
}