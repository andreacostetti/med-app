<script>
    import confetti from 'canvas-confetti';
    import { onMount } from 'svelte';

	function partyBoom() {
		confetti({
			particleCount: 200,
			spread: 70,
			origin: { y: 0.5}, // Parte leggermente più in basso del centro
            zIndex: 9999        // Si assicura che sia sopra ogni cosa
		});
	}

    onMount(() => {
        //partyBoom();
    });
</script>

<main class="p-6">
    <div class="flex justify-end">
        <button class="cursor-pointer p-1 bg-white flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors focus:ring-2 ring-gray-100"><span class="material-symbols-rounded">close</span></button>
    </div>

    <h1 class="text-4xl font-bold font-epilogue mt-4">Risultato</h1>
    <p class="text-gray-500">Il tuo test del 23 aprile 2026, ore 18:13</p>

    <div class="w-full bg-white border border-gray-200 rounded-xl p-6 mt-10">
        <div class="flex justify-between">
            <p class="font-epilogue font-semibold text-lg -mb-3">Punteggio totale</p>
            <span class="material-symbols-rounded text-gray-500 cursor-pointer select-none hover:scale-105 transition-transform" onclick={partyBoom}>celebration</span>
        </div>
        <div class="flex justify-between w-full items-baseline mb-4 mt-3">
            <p class="font-epilogue font-bold text-indigo-600 h-15.5" style="font-size: 55px">85%</p>
            <p class="text-gray-500 text-sm">17 punti</p>
        </div>

        <div class="w-full h-1.5 bg-indigo-200 rounded-xl">
            <div class="bg-indigo-600 w-[85%] h-full rounded-xl"></div>
        </div>

        <div class="flex justify-between w-full mt-8">
            <div class="w-1/3 flex flex-col items-start justify-center">
                <p class="text-emerald-600 font-bold text-2xl font-epilogue">17</p>
                <p class="text-sm text-gray-600">Corrette</p>
            </div>
            <div class="w-1/3 flex flex-col items-center justify-center">
                <p class="text-gray-600 font-bold text-2xl font-epilogue">1</p>
                <p class="text-sm text-gray-600">Non date</p>
            </div>
            <div class="w-1/3 flex flex-col items-end justify-center">
                <p class="text-red-600 font-bold text-2xl font-epilogue">2</p>
                <p class="text-sm text-gray-600">Errate</p>
            </div>
        </div>
    </div>

    <div class="w-full bg-white border border-gray-200 rounded-xl p-6 mt-6">
        <p class="text-gray-600 text-sm mb-2">Tempo impiegato</p>
        <p class="text-2xl font-semibold font-epilogue">42m 15s</p> <!-- AGGIUNGI IMMAGINE A DESTRA, O LOGO TIPO CRONOMETRO O ICON CRONOMETRO ZOOMMATA IN 3D E PROSPETTIVA -->
    </div>
    
    <div class="w-full bg-white border border-gray-200 rounded-xl p-6 mt-3">
        <p class="text-gray-600 text-sm mb-2">Tempo medio per domanda</p>
        <p class="text-gray-600"><span class="text-2xl font-semibold font-epilogue pr-2 text-black dark:text-white">2m 43s</span></p>
    </div>

    <h3 class="text-xl font-epilogue font-semibold mt-10 mb-3">Risposte</h3>
    <div class="w-full flex flex-col gap-6">

        <div class="w-full rounded-xl border border-emerald-200">
            <div class="text-emerald-500 bg-emerald-50 rounded-tl-xl rounded-tr-xl flex items-center gap-1.5 py-2 px-4 border-b-1 border-emerald-200">
                <span class="material-symbols-rounded" style="font-size: 20px">check_circle</span>
                <p class="uppercase tracking-wide text-xs font-semibold">DOMANDA 1</p>
            </div>
            <div class="p-6 text-sm">
                <p>Qual è il gas nobile in cui è occupato completamente l'orbitale 5p?</p>
                <div class="flex w-full justify-between gap-2 mt-4 border border-emerald-400 rounded-lg p-3">
                    <div class="flex w-full gap-2">
                        <span class="material-symbols-rounded w-fit text-emerald-500">radio_button_checked</span>
                        <p>To allow the consumer to magnair e pollo e emortandella fino a doamni</p>
    
                    </div>
                    <span class="material-symbols-rounded text-emerald-500 w-fit ml-3">check</span>
                </div>
            </div>
        </div>
    
        <div class="w-full rounded-xl border border-red-200">
            <div class="text-red-500 bg-red-50 rounded-tl-xl rounded-tr-xl flex items-center gap-1.5 py-2 px-4 border-b-1 border-red-200">
                <span class="material-symbols-rounded" style="font-size: 20px">cancel</span>
                <p class="uppercase tracking-wide text-xs font-semibold">DOMANDA 1</p>
            </div>
            <div class="p-6 text-sm">
                <p>Qual è il gas nobile in cui è occupato completamente l'orbitale 5p?</p>
                <p class="mt-4 text-xs text-red-500">La tua risposta</p>
                <div class="flex w-full justify-between gap-2 mt-1 border border-red-400 rounded-lg p-3">
                    <div class="flex w-full gap-2">
                        <span class="material-symbols-rounded w-fit text-red-500">radio_button_checked</span>
                        <p>To allow the consumer to magnair e pollo e emortandella fino a doamni</p>
    
                    </div>
                    <span class="material-symbols-rounded text-red-500 w-fit ml-3">close</span>
                </div>

                <p class="mt-4 text-xs text-emerald-500">Risposta corretta</p>
                <div class="flex w-full justify-between gap-2 mt-1 border border-emerald-400 rounded-lg p-3">
                    <div class="flex w-full gap-2">
                        <span class="material-symbols-rounded w-fit text-emerald-500">radio_button_unchecked</span>
                        <p>To allow the consumer to magnair e pollo e emortandella fino a doamni</p>
                    </div>
                    <span class="material-symbols-rounded text-emerald-500 w-fit ml-3">check</span>
                </div>
            </div>
        </div>
    </div>

</main>