<script>
    import { goto } from "$app/navigation";
    import BottomBar from "$lib/bottom-bar.svelte";
    import Navbar from "$lib/navbar.svelte";
    import { user } from '$lib/user.svelte.js'; // Importiamo lo stato globale
    import { onMount } from "svelte";
    import googleLogo from "$lib/assets/googleLogo.webp";
    import { 
        subscriptionState, 
        presentPaywall, 
        openCustomerCenter,
        logoutRevenueCat
    } from '$lib/revenuecat.svelte.js';

    // Sicurezza: se l'utente finisce qui ma non è loggato, rimandalo al login
    onMount(async () => {
        const localData = localStorage.getItem("loggedUser");
        if (!user.isLoggedIn && !localData) {
            await logoutRevenueCat();
            goto("/login");
        }
    });

    async function disconnetti() {
        // 1. Resetta lo stato globale del Rune in Svelte 5
        user.isLoggedIn = false;
        user.userInfo = null;

        // 2. Cancella la sessione dal telefono per evitare il login automatico al riavvio
        localStorage.removeItem("loggedUser");
        await logoutRevenueCat();

        // 3. Torna alla schermata di login
        goto("/login");
    }

    function formatDate(dataString) {
        const dataISO = dataString.replace(" ", "T");
        const data = new Date(dataISO);

        const formattatore = new Intl.DateTimeFormat('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const dataFormattata = formattatore.format(data);
        
        return dataFormattata.replace(" ore", "");
    }

    // Estraiamo l'iniziale del nome come fallback se l'immagine di Google non carica
    let inizialenome = $derived(user.userInfo?.displayName ? user.userInfo.displayName.charAt(0).toUpperCase() : 'U');
</script>

<Navbar/>

<main class="p-6 mb-20 max-w-md mx-auto">
    <h1 class="text-4xl font-bold font-epilogue mt-4 dark:text-white">Il tuo account</h1>
    <p class="text-gray-500 dark:text-gray-300 text-sm mt-1">Verifica lo stato del tuo piano e modifica le tue informazioni personali.</p>

    <div class="mt-8 bg-white dark:bg-[#1B1B23] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
        {#if user.userInfo?.photoUrl}
            <img 
                src={user.userInfo.photoUrl} 
                alt="Avatar" 
                class="size-16 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                referrerpolicy="no-referrer"
            />
        {:else}
            <div class="size-16 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl flex items-center justify-center">
                {inizialenome}
            </div>
        {/if}

        <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white truncate">
                {user.userInfo?.displayName || 'Utente UniTest'}
            </h2>
            <p class="text-gray-500 dark:text-gray-300 text-sm truncate">
                {user.userInfo?.email || 'Nessuna email associata'}
            </p>
            <div class="flex items-center gap-2 flex-row mt-2">
                <img src={googleLogo} alt="Google logo" class="size-4">
                {#if subscriptionState.isInitialized}
                    {#if subscriptionState.hasActiveSubscription}
                        <span class="inline-block px-2.5 py-0.5 bg-yellow-400 dark:bg-yellow-400/80 text-gray-700 text-xs font-semibold rounded-md">
                            Pro
                        </span>
                    {:else}
                        <span class="inline-block px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-md">
                            Piano gratuito
                        </span>
                    {/if}
                {/if}
            </div>
        </div>
    </div>

    <div class="mt-6 space-y-3">
        <div class="p-4 bg-white dark:bg-[#1B1B23] shadow-sm border border-gray-100 dark:border-gray-800 rounded-xl flex justify-between items-center">
            <div class="flex items-center gap-3">
                {#if subscriptionState.hasActiveSubscription}
                    <span class="material-symbols-rounded text-green-500">check_circle</span>
                {/if}
                <div>
                    <p class="font-semibold text-sm text-gray-900 dark:text-white">UniTests Pro</p>
                    {#if subscriptionState.hasActiveSubscription}
                        <p class="text-xs text-gray-500 dark:text-gray-300">Attivo</p>
                        <p class="text-xs text-gray-500 dark:text-gray-300">dal {formatDate(subscriptionState.customerInfo?.entitlements.active['Pro']?.originalPurchaseDate)}</p>
                    {:else}
                        <p class="text-xs text-gray-500 dark:text-gray-300">Non attivo</p>
                    {/if}
                </div>
            </div>
            {#if subscriptionState.hasActiveSubscription}
                <button class="text-xs font-bold text-indigo-600 dark:text-indigo-500 hover:underline" onclick={openCustomerCenter}>Gestisci</button>
            {:else}
                <button class="text-xs font-bold text-indigo-600 dark:text-indigo-500 hover:underline" onclick={async () => {await presentPaywall()}}>Scopri di più</button>
            {/if}
            
        </div>
        
        <div class="p-4 bg-white dark:bg-[#1B1B23] border border-gray-100 dark:border-gray-800 rounded-xl flex justify-between items-center">
            <div>
                <p class="font-semibold text-sm text-gray-900 dark:text-white">ID Utente</p>
                <p class="text-xs text-gray-400 font-mono truncate max-w-[180px]">{user.userInfo?.providerData[0]?.uid || 'Non disponibile'}</p>
            </div>
        </div>
    </div>

    <div class="mt-12 flex flex-col gap-3">
        <button 
            onclick={disconnetti}
            class="w-full rounded-xl py-3 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-semibold text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-center"
        >
            Esci
        </button>
    </div>
</main>

<BottomBar page='profile'/>