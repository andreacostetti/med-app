<script>
    import confetti from 'canvas-confetti';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import {user} from "$lib/user.svelte.js"
    import LoadingScreen from "$lib/loadingScreen.svelte";

    let testId = $state(localStorage.getItem('lastTestId'));
    let data = $state(null);
    let showLoading = $state(false);

	function partyBoom() {
		confetti({
			particleCount: 200,
			spread: 70,
			origin: { y: 0.5}, // Parte leggermente più in basso del centro
            zIndex: 9999        // Si assicura che sia sopra ogni cosa
		});
	}

    function getTest() {
        const myHeaders = new Headers();
        myHeaders.append("X-Authorization", "Bearer " + user.token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("https://www.basketscore.it/med-app/test/getScore?testid=" + testId, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            result = JSON.parse(result).data;
            console.log(result);

            data = result;
            showLoading = false;
        }) 
        .catch((error) => console.error(error));
    }

    let totaltime = $derived(data?.totaltime || 0);
    let mediatime = $derived(data?.mediatime || 0);

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
        
        return dataFormattata.replace(" alle", ",");
    }

    onMount(() => {
        showLoading = true;
        getTest();
        partyBoom();
    });
</script>

<main class="p-6">
    <div class="flex justify-end">
        <button class="cursor-pointer p-1 bg-white flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors focus:ring-2 ring-gray-100" onclick={() => {goto('/home')}}><span class="material-symbols-rounded">close</span></button>
    </div>

    <h1 class="text-4xl font-bold font-epilogue mt-4">Risultato test #{testId}</h1>
    {#if data}
        <p class="text-gray-500">Il tuo test del {formatDate(data?.date)}</p>
    {/if}

    <div class="w-full bg-white border border-gray-200 rounded-xl p-6 mt-10">
        <div class="flex justify-between">
            <p class="font-epilogue font-semibold text-lg -mb-3">Punteggio totale</p>
            <span class="material-symbols-rounded text-gray-500 cursor-pointer select-none hover:scale-105 transition-transform" onclick={partyBoom}>celebration</span>
        </div>
        <div class="flex justify-between w-full items-baseline mb-4 mt-3">
            <p class="font-epilogue font-bold text-indigo-600 h-15.5" style="font-size: 55px">{data?.score}%</p>
            <p class="text-gray-500 text-sm">100%</p>
        </div>

        <div class="w-full h-1.5 bg-indigo-200 rounded-xl">
            <div class="bg-indigo-600 h-full rounded-xl" style="width: {data?.score}%"></div>
        </div>

        <div class="flex justify-between w-full mt-8">
            <div class="w-1/3 flex flex-col items-start justify-center">
                <p class="text-emerald-600 font-bold text-2xl font-epilogue">{data?.correct_answers}</p>
                <p class="text-sm text-gray-600">Corrette</p>
            </div>
            <div class="w-1/3 flex flex-col items-center justify-center">
                <p class="text-gray-600 font-bold text-2xl font-epilogue">{data?.notgiven_answers}</p>
                <p class="text-sm text-gray-600">Non date</p>
            </div>
            <div class="w-1/3 flex flex-col items-end justify-center">
                <p class="text-red-600 font-bold text-2xl font-epilogue">{data?.wrong_answers}</p>
                <p class="text-sm text-gray-600">Errate</p>
            </div>
        </div>
    </div>

    <div class="w-full bg-white border border-gray-200 rounded-xl p-6 mt-6">
        <p class="text-gray-600 text-sm mb-2">Tempo impiegato</p>
        <p class="text-2xl font-semibold font-epilogue">{Math.floor(totaltime / 60) == 0 ? "" : Math.floor(totaltime / 60) + "m "} {totaltime > 59 ? totaltime % 60 + "s" : totaltime + "s"}</p> <!-- AGGIUNGI IMMAGINE A DESTRA, O LOGO TIPO CRONOMETRO O ICON CRONOMETRO ZOOMMATA IN 3D E PROSPETTIVA -->
    </div>
    
    <div class="w-full bg-white border border-gray-200 rounded-xl p-6 mt-3">
        <p class="text-gray-600 text-sm mb-2">Tempo medio per domanda</p>
        <p class="text-gray-600"><span class="text-2xl font-semibold font-epilogue pr-2 text-black dark:text-white">{Math.floor(mediatime / 60) == 0 ? "" : Math.floor(mediatime / 60) + "m "} {mediatime > 59 ? mediatime % 60 + "s" : mediatime + "s"}</span></p>
    </div>

    <h3 class="text-xl font-epilogue font-semibold mt-10 mb-3">Risposte</h3>
    <div class="w-full flex flex-col gap-6">

        {#each data?.answers as ans, index}
            {#if ans.isCorrect === 0}
                <div class="w-full rounded-xl border border-red-200">
                    <div class="text-red-500 bg-red-50 rounded-tl-xl rounded-tr-xl flex items-center gap-1.5 py-2 px-4 border-b-1 border-red-200">
                        <span class="material-symbols-rounded" style="font-size: 20px">cancel</span>
                        <p class="uppercase tracking-wide text-xs font-semibold">DOMANDA {index + 1}</p>
                    </div>
                    <div class="p-6 text-sm">
                        <p>{ans.question}</p>
                        <p class="mt-4 text-xs text-red-500">La tua risposta</p>
                        <div class="flex w-full justify-between gap-2 mt-1 border border-red-400 rounded-lg p-3">
                            <div class="flex w-full gap-2">
                                <span class="material-symbols-rounded w-fit text-red-500">radio_button_checked</span>
                                <p>{ans["ans_" + ans.userAnswer]}</p>
            
                            </div>
                            <span class="material-symbols-rounded text-red-500 w-fit ml-3">close</span>
                        </div>

                        <p class="mt-4 text-xs text-emerald-500">Risposta corretta</p>
                        <div class="flex w-full justify-between gap-2 mt-1 border border-emerald-400 rounded-lg p-3">
                            <div class="flex w-full gap-2">
                                <span class="material-symbols-rounded w-fit text-emerald-500">radio_button_unchecked</span>
                                <p>{ans["ans_" + ans.correct_idx]}</p>
                            </div>
                            <span class="material-symbols-rounded text-emerald-500 w-fit ml-3">check</span>
                        </div>
                    </div>
                </div>
            {:else if ans.isCorrect === 1}
                <div class="w-full rounded-xl border border-emerald-200">
                    <div class="text-emerald-500 bg-emerald-50 rounded-tl-xl rounded-tr-xl flex items-center gap-1.5 py-2 px-4 border-b-1 border-emerald-200">
                        <span class="material-symbols-rounded" style="font-size: 20px">check_circle</span>
                        <p class="uppercase tracking-wide text-xs font-semibold">DOMANDA {index + 1}</p>
                    </div>
                    <div class="p-6 text-sm">
                        <p>{ans.question}</p>
                        <div class="flex w-full justify-between gap-2 mt-4 border border-emerald-400 rounded-lg p-3">
                            <div class="flex w-full gap-2">
                                <span class="material-symbols-rounded w-fit text-emerald-500">radio_button_checked</span>
                                <p>{ans["ans_" + ans.userAnswer]}</p>
            
                            </div>
                            <span class="material-symbols-rounded text-emerald-500 w-fit ml-3">check</span>
                        </div>
                    </div>
                </div>
            {/if}

        {/each}
        
    
        
    </div>

    
</main>

{#if showLoading}
    <LoadingScreen />
{/if}