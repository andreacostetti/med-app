<script>
    import { goto } from "$app/navigation";
    import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
    import { user } from '$lib/user.svelte.js';
    import { onMount } from "svelte";
    import { Capacitor } from '@capacitor/core';
    import { getValidToken } from "$lib/api";
    import appLogo from '$lib/assets/full-icon.jpg'
    import { loginRevenueCat } from "$lib/revenuecat.svelte";


    let caricamento = $state(false);
    let errore = $state('');
    let from = $state('');
    let storedUser = $state(null);

    async function accediConGoogle() {
        caricamento = true;
        errore = '';
        
        try {
            const platform = Capacitor.getPlatform();
            const options = platform === 'android' 
            ? { clientId: '985142651823-qeanh1ifchgapq2v3g8b5dcq8hgle8ns.apps.googleusercontent.com' } 
            : undefined;

            const result = await FirebaseAuthentication.signInWithGoogle(options);
            
            const googleUser = result.user;

            let idToken = await getValidToken();

            if (!idToken) {
                throw new Error("Impossibile recuperare il token di autenticazione.");
            }

            console.log("Login Google riuscito per:", googleUser.displayName);

            const myHeaders = new Headers();
            myHeaders.append("X-Authorization", "Bearer " + idToken);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                redirect: "follow"
            };

            const response = await fetch("https://www.basketscore.it/med-app/user/add", requestOptions);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Errore Server (${response.status}): ${errorText || 'Nessun dettaglio fornito'}`);
            }

            const serverResult = await response.text();
            console.log("Risposta dal server:", serverResult);

            user.isLoggedIn = true;
            user.userInfo = googleUser; 

            localStorage.setItem("loggedUser", JSON.stringify(user));
            await loginRevenueCat(user.userInfo?.providerData[0]?.uid);
            
            goto('/home');

        } catch (err) {
            console.error("Errore durante il login:", err);
            errore = err.message || "Errore sconosciuto durante l'accesso";
        } finally {
            caricamento = false;
        }
    }

    onMount(() => {
        const localData = localStorage.getItem("loggedUser");
        
        if (localData) {
            storedUser = JSON.parse(localData);
        }

        if (user.isLoggedIn) {
            goto('/home');
            from = "memory";
            return;
        }

        if (storedUser && storedUser.isLoggedIn) {
            user.token = storedUser.token;
            user.userInfo = storedUser.userInfo;
            user.isLoggedIn = storedUser.isLoggedIn;
            goto('/home');
            from = "localstorage";
        }
    });

</script>

<main class="p-6 flex items-center justify-center h-[90vh] w-screen">
    <div>
        <div class="bg-gray-300 text-xs text-gray-600 rounded-xl size-13 flex items-center justify-center">
        <img src={appLogo} alt="" class="rounded-xl">
        </div>
        <h1 class="text-4xl font-bold font-epilogue mt-8">Accedi</h1>
        <p class="text-gray-600 dark:text-white mb-6">Bentornato in TestUni. Accedi con il tuo account Google per continuare.</p>

        {#if errore}
            <div class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm w-screen max-w-screen">
                {errore}
            </div>
        {/if}
        
        <button 
            onclick={accediConGoogle} 
            disabled={caricamento}
            class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold p-3 rounded-xl shadow-sm hover:bg-gray-50 transition disabled:opacity-50"
        >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.42 15 0 12 0 7.35 0 3.37 2.67 1.42 6.56l3.86 3c.92-2.76 3.51-4.52 6.72-4.52z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.48-1.12 2.74-2.38 3.58l3.69 2.86c2.16-1.99 3.42-4.91 3.42-8.54z"/>
                <path fill="#FBBC05" d="M5.28 14.56c-.24-.72-.38-1.5-.38-2.31s.14-1.59.38-2.31L1.42 6.56C.52 8.37 0 10.41 0 12.5s.52 4.13 1.42 5.94l3.86-3z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.86c-1.02.68-2.33 1.09-3.96 1.09-3.21 0-5.8-1.76-6.77-4.52l-3.86 3C3.37 21.33 7.35 24 12 24z"/>
            </svg>
            
            {#if caricamento}
                Connessione in corso...
            {:else}
                Continua con Google
            {/if}
        </button>
    </div>
</main>