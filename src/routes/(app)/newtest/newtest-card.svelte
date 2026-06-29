<script>
    import { subscriptionState, presentPaywall } from "$lib/revenuecat.svelte";
    let {name, checked, argument, nquestions, subjects, img = ""} = $props();
    
</script>

<div class="w-full rounded-xl cursor-pointer relative hover:scale-101 transition-transform select-none" onclick={() => {toggleSelection(argument)}}>
    {#if !subscriptionState.hasActiveSubscription} 
        <div class="rounded-lg flex items-center justify-center text-xs px-2.5 py-0.5 font-medium bg-indigo-600 border-indigo-600 border text-white absolute top-4 left-4 select-none">
            Disponibile con Pro
        </div>
    {/if}

    {#if checked}
        <div class="rounded-lg size-8 flex items-center justify-center bg-indigo-600 border-indigo-600 border text-white absolute top-4 right-4 select-none transition-all">
            <span class="material-symbols-rounded">check</span>
        </div>
    {:else}
        <div class="rounded-lg size-8 flex items-center justify-center bg-white border-gray-200 border text-gray-400 absolute top-4 right-4 select-none transition-all">
            <span class="material-symbols-rounded">check</span>
        </div>
    {/if}
    {#if argument == "fullTest"}
    <div class="h-36 bg-gray-300 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-tl-xl rounded-tr-xl flex items-center justify-center">
        <span class="material-symbols-rounded" style="font-size: 50px; font-variation-settings: 'FILL' 1;">cards_stack</span>
    </div>
    {:else}
        <img src={img} alt="subject cover image" class="rounded-tl-xl rounded-tr-xl w-full h-36 object-cover">
    {/if}
    
    <div class="w-full bg-white dark:bg-gray-800 p-6 rounded-bl-xl rounded-br-xl">
        <h3 class="text-lg font-semibold font-epilogue">{name}</h3>
        <p class="text-gray-500 dark:text-gray-300 text-sm">{nquestions} domande. {subjects}</p>
        <a href="" class="text-sm text-indigo-600 dark:text-indigo-400 active:underline" onclick={(event) => {event.preventDefault(); event.stopPropagation(); showPopup(argument);}}>Vedi argomenti</a>
    </div>
    
</div>