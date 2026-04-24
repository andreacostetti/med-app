<script>
    let {materia, data, ora, superato, id, argomenti, perc} = $props();
    let icon = $state(null);

    // svelte-ignore state_referenced_locally
    if(materia == 'Chimica') {
        icon = "experiment";
    } else if (materia == "Matematica") {
        icon = "calculate";
    } else if (materia == "Biologia") {
        icon = "biotech";
    }
</script>

<div class="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-6">
    <div class="flex items-center gap-2 justify-between">
        <div class="flex items-center gap-3">
            <span class="material-symbols-rounded p-3 rounded-xl text-indigo-600 bg-indigo-100 dark:bg-indigo-600/20" style="font-size: 24px">{icon}</span>
            <div>
                <p class="font-bold text-lg">{materia}</p>
            </div>
        </div>
        {#if superato}
        <div class="rounded-full w-fit text-sm flex items-center gap-1 px-2.5 py-1 justify-center bg-green-200/40 text-green-700 border border-green-200">
            <span class="material-symbols-rounded">check</span>
            <p>Superato</p> 
        </div>
        {:else}
        <div class="rounded-full w-fit text-sm flex items-center gap-1 px-2.5 py-1 justify-center bg-red-200/40 text-red-700 border border-red-200">
            <span class="material-symbols-rounded">close</span>
            <p>Non superato</p> 
        </div>
        {/if}
    </div>
    <ul class="list-disc ml-6 mt-6 text-gray-600">
        {#each argomenti as arg}
            <li>{arg}</li>
        {/each}
    </ul>

    <div class="flex items-center gap-3 w-full mt-6">
        <div class="w-full bg-indigo-500/20 rounded-full h-1.5 overflow-hidden">
            <div class="bg-indigo-500 h-full rounded-full" style="width: 65%;"></div>
        </div>
        <p class="text-xs">{perc}%</p>
    </div>

    <div class="flex items-center justify-between mt-3">
        <p class="text-sm text-gray-500/90">{data}, {ora}</p>
        <p class="text-indigo-600 hover:underline text-sm cursor-pointer select-none">Dettagli</p>
    </div>
</div>