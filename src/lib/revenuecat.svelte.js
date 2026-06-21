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

export async function initRevenueCat() {
    if (!Capacitor.isNativePlatform()) return;

    try {
        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

        const savedUserId = user.userInfo?.providerData[0]?.uid;
        
        const config = { 
            apiKey: "test_VQRRmunLkqNVPVVRyqqjLkOMFzc"
        };
        
        await Purchases.configure(config);
        
        subscriptionState.isInitialized = true;
        await refreshCustomerInfo();

        Purchases.addCustomerInfoUpdateListener((customerInfo) => {
            subscriptionState.customerInfo = customerInfo;
            subscriptionState.hasActiveSubscription = 
                typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
        });

    } catch (error) {
        console.error("RevenueCat Init Error:", error);
    }
}

export async function loginRevenueCat(googleUid) {
    if (!Capacitor.isNativePlatform() || !googleUid) return;

    try {
        const { customerInfo } = await Purchases.logIn({ appUserID: googleUid });
        
        subscriptionState.customerInfo = customerInfo;
        subscriptionState.hasActiveSubscription = 
            typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
            
        //console.log("RevenueCat ora è legato a:", googleUid);
    } catch (error) {
        console.error("Errore durante logIn:", error);
    }
}

export async function logoutRevenueCat() {
    if (!Capacitor.isNativePlatform()) return;

    try {
        const customerInfo = await Purchases.logOut();
        
        subscriptionState.customerInfo = customerInfo;
        subscriptionState.hasActiveSubscription = false;
        
        console.log("RevenueCat Logout effettuato.");
    } catch (error) {
        console.error("Errore durante il logout da RevenueCat:", error);
    }
}

export async function refreshCustomerInfo() {
    if (!Capacitor.isNativePlatform()) return;

    try {
        const customerInfo = await Purchases.getCustomerInfo();
        subscriptionState.customerInfo = customerInfo;
        
        // FIX: previene il crash
        subscriptionState.hasActiveSubscription = 
            typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
            
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
        
        subscriptionState.customerInfo = customerInfo;
        subscriptionState.hasActiveSubscription = 
            typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined'; 
            
        return subscriptionState.hasActiveSubscription;
    } catch (error) {
        console.error("Errore nel restore:", error);
        return false;
    }
}