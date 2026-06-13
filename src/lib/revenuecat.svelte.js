import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';
import { Capacitor } from '@capacitor/core';

// Global reactive state for the SDK
export let subscriptionState = $state({
    customerInfo: null,
    hasActiveSubscription: false,
    isInitialized: false,
    error: null
});

// The entitlement ID you will set up in RevenueCat (e.g., 'pro')
const ENTITLEMENT_ID = 'Pro'; 

export async function initRevenueCat() {
    if (!Capacitor.isNativePlatform()) return;

    try {
        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
        
        // AGGIUNTA FONDAMENTALE: appUserID fisso per i test
        await Purchases.configure({ 
            apiKey: "test_VQRRmunLkqNVPVVRyqqjLkOMFzc",
            appUserID: "test_developer_01" 
        });
        
        subscriptionState.isInitialized = true;
        await refreshCustomerInfo();

        Purchases.addCustomerInfoUpdateListener((customerInfo) => {
            subscriptionState.customerInfo = customerInfo;
            subscriptionState.hasActiveSubscription = 
            customerInfo.entitlements.active[ENTITLEMENT_ID].isActive;
        });

    } catch (error) {
        console.error("RevenueCat Init Error:", error);
    }
}

export async function refreshCustomerInfo() {
    if (!Capacitor.isNativePlatform()) return;

    try {
        const customerInfo = await Purchases.getCustomerInfo();
        subscriptionState.customerInfo = customerInfo;
        
        // Check if the specific entitlement is active
        subscriptionState.hasActiveSubscription = 
            customerInfo.entitlements.active[ENTITLEMENT_ID].isActive;
            
    } catch (error) {
        console.error("Failed to fetch customer info:", error);
    }
}

export async function presentPaywall() {
    if (!Capacitor.isNativePlatform()) return false;

    try {
        const paywallResult = await RevenueCatUI.presentPaywall();
        
        // paywallResult è una stringa che può essere: "PURCHASED", "CANCELLED", "RESTORED", "ERROR"
        console.log("ESITO PAYWALL:", paywallResult);
        
        // Se il risultato nativo dice che è stato acquistato o ripristinato, forziamo il refresh
        if (paywallResult === 'PURCHASED' || paywallResult === 'RESTORED') {
            await restorePurchases(); // Usiamo restore invece di refresh per essere sicuri al 100%
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
        // Refresh when they return, as they may have canceled or changed plans
        await refreshCustomerInfo();
    } catch (error) {
        console.error("Customer Center Error:", error);
    }
}

export async function restorePurchases() {
    if (!Capacitor.isNativePlatform()) return false;

    try {
        console.log("Forzando la sincronizzazione con il server...");
        // Questo comando fa la magia: forza il sync
        const customerInfo = await Purchases.restorePurchases();
        
        // Aggiorniamo lo stato
        subscriptionState.customerInfo = customerInfo;
        subscriptionState.hasActiveSubscription = 
            typeof customerInfo.entitlements.active['pro'] !== 'undefined'; // Usa il tuo ID!
            
        return subscriptionState.hasActiveSubscription;
    } catch (error) {
        console.error("Errore nel restore:", error);
        return false;
    }
}