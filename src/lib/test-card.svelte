<script>
    import { goto } from "$app/navigation";

    // Aggiunto "punteggio" alle props
    let {materia, data, ora, superato, id, argomenti, perc = 0, completed, nquestions, nanswered, punteggio, ncorrect} = $props();

    const materieMap = {
        chimica: { icon: "experiment", nome: "Chimica" },
        fismat: { icon: "function", nome: "Fisica e matematica" },
        biologia: { icon: "biotech", nome: "Biologia" },
        logica: { icon: "crossword", nome: "Logica" },
        competenze: { icon: "globe", nome: "Competenze" },
        mix: { icon: "shuffle", nome: "Test misto" }
    };

    let config = $derived(materieMap[materia] || { icon: "help", nome: materia });
    let icon = $derived(config.icon);
    let nome = $derived(config.nome);

    let radius = 20;
    let circumference = $derived(2 * Math.PI * radius);
    let strokeOffset = $derived(circumference - (perc / 100) * circumference);

    function openDetails() {
        localStorage.setItem('lastTestId', id);
        goto(`/result`);
    }

    function resumeTest() {
        localStorage.setItem('lastTestId', id);
        goto(`/test`);
    }
</script>

<div class="relative bg-white dark:bg-[#222229] border border-gray-200 dark:border-[#3b3b3f] rounded-2xl p-6 shadow-sm active:shadow-md active:-translate-y-0.5 transition-all duration-300 overflow-hidden">
    

    <div class="flex items-start md:items-center gap-2 justify-between">
        <div class="flex items-center gap-4">
            <div class="flex items-center justify-center size-12 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 shrink-0">
                <span class="material-symbols-rounded" style="font-size: 24px">{icon}</span>
            </div>
            <div>
                <p class="font-bold text-lg text-gray-900 dark:text-white">{nome}</p>
                {#if completed == 1}
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{data.split("-").reverse().join("/")} • {ora.slice(0, 5)}</p>
                {/if}
            </div>
        </div>
        

        {#if completed == 1}
                {#if superato == 1}
                    <div class="rounded-full shrink-0 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 px-3 py-1.5 justify-center bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 shadow-sm">
                        <span class="material-symbols-rounded" style="font-size: 16px;">check_circle</span>
                    </div>
                {:else if superato == 0}
                    <div class="rounded-full shrink-0 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 px-3 py-1.5 justify-center bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 shadow-sm">
                        <span class="material-symbols-rounded" style="font-size: 16px;">cancel</span>
                    </div>
                {/if}
        {/if}   
    </div>

    {#if completed == 1 && punteggio !== undefined}
        <div class="mt-5 flex items-center gap-4 p-3.5 rounded-xl bg-gray-50 dark:bg-[#2a2a32] border border-gray-100 dark:border-[#3b3b3f]">
            <div class="flex-1 pl-2">
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Punteggio</p>
                <div class="flex items-baseline gap-1">
                    <p class="text-2xl font-black {superato ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">{punteggio}%</p>
                </div>
            </div>
            <div class="w-px h-10 bg-gray-200 dark:bg-[#45454b]"></div>
            <div class="flex-1">
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Risposte corrette</p>
                <p class="text-md font-bold text-gray-700 dark:text-gray-100 mt-1">{ncorrect} <span class="text-gray-400 dark:text-gray-300 font-normal text-sm">/ {nquestions}</span></p>
            </div>
        </div>
    {/if}

    {#if completed == 0}
        <div class="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
            <div class="flex items-center gap-4 flex-1">
                <div class="relative size-14 flex items-center justify-center shrink-0">
                    <svg class="size-full -rotate-90 transform" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="{radius}" fill="none" class="stroke-indigo-200/50 dark:stroke-indigo-900/50" stroke-width="4"></circle>
                        <circle cx="24" cy="24" r="{radius}" fill="none" class="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-1000 ease-out" stroke-width="4" stroke-dasharray="{circumference}" stroke-dashoffset="{strokeOffset}" stroke-linecap="round"></circle>
                    </svg>
                    <span class="absolute text-xs font-bold text-indigo-700 dark:text-indigo-400">{Math.round(perc)}%</span>
                </div>
                
                <div class="flex-1">
                    <p class="text-sm font-bold text-gray-800 dark:text-gray-200">Test in sospeso</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Riprendi da dove ti eri fermato.</p>
                </div>
            </div>

            <!-- Pulsante (sotto su mobile, a destra su schermi >= sm) -->
            <button class="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white px-5 py-2.5 text-sm font-semibold rounded-lg cursor-pointer shadow-sm shadow-indigo-600/30 w-full sm:w-auto shrink-0" onclick={() => resumeTest()}>
                Riprendi
            </button>
        </div>
    {/if}

    <!-- {#if materia == "mix" && argomenti?.length > 0}
        <div class="mt-6 pt-5 border-t border-gray-100 dark:border-[#3b3b3f]">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Argomenti del test</p>
            <div class="flex flex-wrap gap-2">
                {#each argomenti as arg}
                    <span class="text-xs font-medium px-3 py-1.5 bg-gray-50 text-gray-700 dark:bg-[#2a2a32] dark:text-gray-300 rounded-lg border border-gray-200 dark:border-[#45454b]">
                        {arg}
                    </span>
                {/each}
            </div>
        </div>
    {/if} -->

    {#if completed == 1}
        <div class="mt-6">
            <button class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 dark:border-[#45454b] text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a32] active:scale-[0.98] transition-all cursor-pointer" onclick={() => openDetails()}>
                Vedi dettagli <span class="material-symbols-rounded" style="font-size: 18px;">arrow_forward</span>
            </button>
        </div>
    {/if}
</div>