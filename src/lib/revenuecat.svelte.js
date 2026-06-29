import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';
import { Capacitor } from '@capacitor/core';
import { user } from './user.svelte.js';

export let subscriptionState = $state({
    customerInfo: null,
    hasActiveSubscription: false,
    isInitialized: false,
    error: null
});

const ENTITLEMENT_ID = 'Pro'; 

// Helper interno per aggiornare lo stato di Svelte
function updateState(customerInfo) {
    subscriptionState.customerInfo = customerInfo;
    subscriptionState.hasActiveSubscription = 
        typeof customerInfo?.entitlements?.active[ENTITLEMENT_ID] !== 'undefined';
}

// Helper per forzare l'estrazione ESCLUSIVA del Google UID (providerData[0])
function getStrictGoogleUid() {
    if (user.userInfo?.providerData && user.userInfo.providerData.length > 0) {
        return user.userInfo.providerData[0].uid;
    }
    return null;
}

export async function syncRevenueCatUser(explicitGoogleUid = null) {
    if (!Capacitor.isNativePlatform()) return;

    try {
        // Prende l'UID passato manualmente, OPPURE forza la lettura da providerData[0]
        const googleUidToAuth = explicitGoogleUid || getStrictGoogleUid();

        // 1. CONFIGURAZIONE INIZIALE
        if (!subscriptionState.isInitialized) {
            await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
            
            if (Capacitor.getPlatform() === 'android') {
                await Purchases.configure({ 
                    apiKey: "goog_AbzRBqrXKzjvEKKBGGqcuVHRaNG" 
                    //apiKey: "test_VQRRmunLkqNVPVVRyqqjLkOMFzc" 
                });
            }
            
            subscriptionState.isInitialized = true;

            Purchases.addCustomerInfoUpdateListener((customerInfo) => {
                updateState(customerInfo);
            });
        }

        // 2. GESTIONE DINAMICA DELL'IDENTITÀ
        const currentAppUserID = await Purchases.getAppUserID();

        if (googleUidToAuth) {
            // Se l'ID attuale di RC è diverso dal Google UID, forziamo il LogIn
            if (currentAppUserID !== googleUidToAuth) {
                console.log(`Cambio utente: da ${currentAppUserID} a Google UID: ${googleUidToAuth}. Eseguo LogIn.`);
                const { customerInfo } = await Purchases.logIn({ appUserID: googleUidToAuth });
                updateState(customerInfo);
            } else {
                await refreshCustomerInfo();
            }
        } else {
            // Nessun Google UID rilevato (Logout)
            if (!currentAppUserID.startsWith('$RCAnonymousID')) {
                console.log("Nessun account Google rilevato. Torno in modalità anonima.");
                const customerInfo = await Purchases.logOut();
                updateState(customerInfo);
            } else {
                await refreshCustomerInfo();
            }
        }

    } catch (error) {
        console.error("RevenueCat Sync Error:", error);
        subscriptionState.error = error;
    }
}

export async function loginRevenueCat(googleUid) {
    await syncRevenueCatUser(googleUid);
}

export async function logoutRevenueCat() {
    await syncRevenueCatUser(null);
}

export async function refreshCustomerInfo() {
    if (!Capacitor.isNativePlatform()) return;
    try {
        const customerInfo = await Purchases.getCustomerInfo();

        //console.log("STATO ENTITLEMENTS REVENUECAT:", JSON.stringify(customerInfo.entitlements, null, 2));

        updateState(customerInfo);
    } catch (error) {
        console.error("Failed to fetch customer info:", error);
    }
}

export async function presentPaywall() {
    if (!Capacitor.isNativePlatform()) return false;
    try {
        const paywallResult = await RevenueCatUI.presentPaywall();
        console.log("ESITO PAYWALL:", paywallResult);
        
        if (paywallResult === 'PURCHASED' || paywallResult === 'RESTORED') {
            await restorePurchases(); 
        }
        return subscriptionState.hasActiveSubscription;
    } catch (error) {
        console.error("Paywall Error:", error);
        return false;
    }
}

export async function openCustomerCenter() {
    if (!Capacitor.isNativePlatform()) return;
    try {
        await RevenueCatUI.presentCustomerCenter();
        await refreshCustomerInfo();
    } catch (error) {
        console.error("Customer Center Error:", error);
    }
}

export async function restorePurchases() {
    if (!Capacitor.isNativePlatform()) return false;
    try {
        console.log("Forzando la sincronizzazione con il server...");
        const customerInfo = await Purchases.restorePurchases();
        updateState(customerInfo);
        return subscriptionState.hasActiveSubscription;
    } catch (error) {
        console.error("Errore nel restore:", error);
        return false;
    }
}