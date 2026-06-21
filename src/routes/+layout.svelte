<script>
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import { Capacitor } from '@capacitor/core';
    import { StatusBar, Style } from '@capacitor/status-bar';
    import { onMount } from 'svelte';
    import { initRevenueCat } from '$lib/revenuecat.svelte';
    //import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';
    //import { FirebasePerformance } from '@capacitor-firebase/performance';
    
    let { children } = $props();

    let isDarkMode = $state(false);
	let isAndroid = $state(false);

    onMount(async () => {
		isAndroid = Capacitor.getPlatform() === 'android';
        if (Capacitor.isNativePlatform()) {
            try {
                await StatusBar.show();
                await StatusBar.setOverlaysWebView({ overlay: false });

                //await FirebaseCrashlytics.setCrashlyticsCollectionEnabled({ enabled: true });
                //await FirebasePerformance.setPerformanceCollectionEnabled({ enabled: true });
                //await FirebaseCrashlytics.setUserId({ userId: 'ID_UTENTE_SE_DISPONIBILE' });
            } catch (err) {
                console.error("Errore inizializzazione StatusBar:", err);
            }
        }

        // 2. Inizializza RevenueCat
        initRevenueCat();
        
        // 3. Gestione Dark Mode
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

    async function updateNativeStatusBar(dark) {
        try {
            if (dark) {
                await StatusBar.setStyle({ style: Style.Dark });
                await StatusBar.setBackgroundColor({ color: '#16161d' }); 
            } else {
                await StatusBar.setStyle({ style: Style.Light });
                await StatusBar.setBackgroundColor({ color: '#ffffff' }); 
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