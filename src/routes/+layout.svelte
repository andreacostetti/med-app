<script>
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import { Capacitor } from '@capacitor/core';
    import { page } from '$app/stores';
    import { StatusBar, Style } from '@capacitor/status-bar';
    import { onMount } from 'svelte';
    import { syncRevenueCatUser } from '$lib/revenuecat.svelte.js';
    import { user } from '$lib/user.svelte';
    import {initPushNotifications } from "$lib/pushNotifications";
    
    let { children } = $props();

    let isDarkMode = $state(false);
	let isAndroid = $state(false);

    onMount(async () => {
		isAndroid = Capacitor.getPlatform() === 'android';

        await initPushNotifications();

        if (Capacitor.isNativePlatform()) {
            try {
                await StatusBar.show();
                await StatusBar.setOverlaysWebView({ overlay: false });
            } catch (err) {
                console.error("Errore inizializzazione StatusBar:", err);
            }
        }
        
        // 3. Dark Mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        isDarkMode = mediaQuery.matches;

        // Imposta subito il colore corretto all'avvio
        if (Capacitor.isNativePlatform()) {
            updateNativeStatusBar(isDarkMode);
        }

        const handleChange = (e) => {
            isDarkMode = e.matches;
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    });

    $effect(() => {
        if (Capacitor.isNativePlatform()) {
            updateNativeStatusBar(isDarkMode);
        }
    });

    $effect(() => {
        let currentUid = user.userInfo?.providerData?.[0]?.uid || null;
        syncRevenueCatUser(currentUid);
    });

    async function updateNativeStatusBar(dark) {
        try {
            const { NavigationBar } = await import('@capacitor/navigation-bar');

            if (dark) {
                await StatusBar.setStyle({ style: Style.Dark });
                await StatusBar.setBackgroundColor({ color: '#16161d' }); 

                await NavigationBar.setColor({ color: '#1B1B23', darkButtons: false });
            } else {
                await StatusBar.setStyle({ style: Style.Light });
                await StatusBar.setBackgroundColor({ color: '#ffffff' }); 
                await NavigationBar.setColor({ color: '#ffffff', darkButtons: true });
            }
        } catch (error) {
            console.error('Failed to update status bar:', error);
        }
    }
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div 
    class="min-h-screen w-full flex flex-col bg-white dark:bg-[#16161d]" 
    style={isAndroid ? "padding-top: max(env(safe-area-inset-top), 45px);" : ""}
>

{#if isAndroid}
        <div 
            class="fixed top-0 left-0 w-full z-[9999] bg-white dark:bg-[#16161d] border-gray-100 dark:border-gray-800"
            style="height: max(env(safe-area-inset-top), 45px);"
        ></div>
    {/if}
    {@render children()}
</div>