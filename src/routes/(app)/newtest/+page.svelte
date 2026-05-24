<script>
    let checked = $state(false);
</script>

<main class="p-6 mt-10">
    <div class="flex items-center gap-1 mb-4 text-gray-700 cursor-pointer">
        <span class="material-symbols-rounded">arrow_back</span>
        <p>Torna alla home</p>
    </div>
    <h1 class="font-bold font-epilogue text-4xl">Nuovo test</h1>
    <p class="text-gray-600 mt-1 mb-6">Scegli se svolgere un test completo o selezionare gli argomenti su cui allenarti, poi avvia l'esercitazione.</p>

    <div class="w-full rounded-xl cursor-pointer relative hover:scale-101 tnransition-transform select-none" onclick={() => {checked = !checked}}>
        {#if checked}
            <div class="rounded-lg size-8 flex items-center justify-center bg-indigo-600 border-indigo-600 border text-white absolute top-4 right-4 select-none transition-all">
                <span class="material-symbols-rounded">check</span>
            </div>
        {:else}
            <div class="rounded-lg size-8 flex items-center justify-center bg-white border-gray-200 border text-gray-400 absolute top-4 right-4 select-none transition-all">
                <span class="material-symbols-rounded">check</span>
            </div>
        {/if}
        <div class="h-36 bg-gray-300 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-tl-xl rounded-tr-xl flex items-center justify-center">
            <span class="material-symbols-rounded" style="font-size: 50px; font-variation-settings: 'FILL' 1;">cards_stack</span>
        </div>
        
        <div class="w-full bg-white dark:bg-gray-800 p-6 rounded-bl-xl rounded-br-xl">
            <h3 class="text-lg font-semibold font-epilogue">Test completo</h3>
            <p class="text-gray-500 text-sm">1358 domande. Fisica, Matematica, Biologia, Italiano.</p>
            <a href="" class="text-sm text-indigo-600 hover:underline">Vedi argomenti</a>
        </div>
        
    </div>
    
    <div class="w-full flex items-center gap-3 my-4">
        <span class="w-full border border-gray-300 dark:border-gray-700"></span>
        <p class="text-sm dark:text-gray-400">oppure</p>
        <span class="w-full border border-gray-300 dark:border-gray-700"></span>
    </div>

    <div class="w-full rounded-xl cursor-pointer relative hover:scale-101 transition-transform select-none" onclick={() => {checked = !checked}}>
        {#if checked}
            <div class="rounded-lg size-8 flex items-center justify-center bg-indigo-600 border-indigo-600 border text-white absolute top-4 right-4 select-none transition-all">
                <span class="material-symbols-rounded">check</span>
            </div>
        {:else}
            <div class="rounded-lg size-8 flex items-center justify-center bg-white border-gray-200 border text-gray-400 absolute top-4 right-4 select-none transition-all">
                <span class="material-symbols-rounded">check</span>
            </div>
        {/if}
        <img src="https://www.sardegnaricerche.it/immagini/13_398_20170710105342.png" alt="" class="rounded-tl-xl rounded-tr-xl w-full h-36 object-cover">
        
        <div class="w-full bg-white dark:bg-gray-800 p-6 rounded-bl-xl rounded-br-xl">
            <h3 class="text-lg font-semibold font-epilogue">Biologia</h3>
            <p class="text-gray-500 text-sm">346 domande</p>
            <a href="" class="text-sm text-indigo-600 hover:underline">Vedi argomenti</a>
        </div>
        
    </div>
</main>