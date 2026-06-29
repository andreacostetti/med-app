<script>
    import { fly } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';

    let { onClose, explanation = '', loading } = $props();
</script>

<div 
    class="fixed inset-0 z-[999] flex h-screen w-screen items-end justify-center bg-black/40" 
    onclick={onClose}
>
    
    <div 
        class="w-full max-w-[500px] rounded-t-[26px] bg-white dark:bg-gray-700 dark:text-white p-5 pb-[calc(env(safe-area-inset-bottom)+32px)] shadow-[0_-5px_20px_rgba(0,0,0,0.15)]"
        transition:fly={{ y: 500, duration: 400, easing: cubicOut }}
        onclick={(e) => e.stopPropagation()}>
        <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        
        {#if loading}
            <div class="w-full flex items-center justify-center">
                <svg aria-hidden="true" class="size-10 text-white fill-indigo-600 animate-spin my-4" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        {:else}
            <div class="mb-8 text-gray-800 dark:text-white">
                <h3 class="mb-4 text-xl font-bold flex items-center gap-1"><span><svg xmlns="http://www.w3.org/2000/svg" class="size-5 fill-indigo-600" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 480.24"><path fill-rule="nonzero" d="M512 220.6c-163.88 61.72-149.02 38.94-206.92 208.29-57.91-169.35-43.06-146.57-206.92-208.26 163.86-61.72 149.01-38.95 206.92-208.3C362.98 181.68 348.12 158.91 512 220.6zM193.38 382.9c-76.59 28.86-69.65 18.21-96.71 97.34C69.63 401.11 76.59 411.76 0 382.9c76.59-28.81 69.63-18.15 96.67-97.31 27.06 79.16 20.12 68.5 96.71 97.31zm8.2-316.66c-52.13 19.66-47.41 12.38-65.81 66.28-18.43-53.86-13.69-46.62-65.84-66.28C122.08 46.63 117.34 53.87 135.77 0c18.4 53.87 13.68 46.63 65.81 66.24z"/></svg></span>Spiegazione errore</h3>
                <p class="text-sm leading-relaxed">
                    {explanation || 'Caricamento spiegazione...'}
                </p>
            </div>
            
            <button 
                class="w-full rounded-2xl bg-indigo-600 dark:bg-indigo-500 p-3 font-semibold text-white transition-colors active:bg-indigo-700 dark:active:bg-indigo-600" 
                onclick={onClose}>
                Capito
            </button>

            <p class="text-gray-400 dark:text-gray-600 text-xs text-center w-full mt-2">L'AI può commettere errori.</p>
        {/if}

        
    </div>

</div>