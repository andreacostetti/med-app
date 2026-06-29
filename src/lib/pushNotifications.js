import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { getValidToken } from "$lib/api";

export async function initPushNotifications() {
    if (!Capacitor.isNativePlatform()) return;

    // 1. Richiedi il permesso all'utente
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
        console.warn("Permesso notifiche negato dall'utente.");
        return;
    }

    // 2. Registra il dispositivo su Firebase Cloud Messaging
    await PushNotifications.register();

    // 3. Ascolta l'evento di registrazione per ottenere il Token FCM del dispositivo
    await PushNotifications.addListener('registration', async (token) => {
        let jwt = await getValidToken();
        const info = await Device.getInfo();
        const deviceModel = `${info.manufacturer} ${info.model}`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("X-Authorization", "Bearer " + jwt);

        const urlencoded = new URLSearchParams();
        urlencoded.append("fcm_token", token.value);
        urlencoded.append("device_model", deviceModel);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow"
        };

        fetch("https://www.basketscore.it/med-app/user/addFcm", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    });

    await PushNotifications.addListener('registrationError', (err) => {
        console.error('Errore registrazione Push:', err);
    });

    // 4. Cosa fare quando arriva una notifica con l'app APERTA (in primo piano)
    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notifica ricevuta in primo piano:', notification);
        // Puoi usare un toast o un avviso interno se vuoi mostrarla graficamente
    });

    // 5. Cosa fare quando l'utente CLICCA sulla notifica (ad app chiusa o in background)
    await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('L\'utente ha cliccato sulla notifica:', action.notification);
        // Esempio: goto('/history') se vuoi mandarlo in una pagina specifica
    });
}