<script>
    import confetti from 'canvas-confetti';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import {user} from "$lib/user.svelte.js"
    import LoadingScreen from "$lib/loadingScreen.svelte";
    import { getValidToken } from "$lib/api";
    import aiIcon from '$lib/assets/ai-sparkle-icon.png';
    import AiPopup from "./aipopup.svelte";

    import { 
        subscriptionState, 
        presentPaywall, 
        openCustomerCenter 
    } from '$lib/revenuecat.svelte.js';
    import { json } from '@sveltejs/kit';
    import { getAI } from 'firebase/ai';
    

    let testId = $state(localStorage.getItem('lastTestId'));
    let data = $state(null);
    let showLoading = $state(false);
    let aiResponse = $state(null);
    let aiLoading = $state(false);
    let showAiPopup = $state(false);

	function partyBoom() {
		confetti({
			particleCount: 200,
			spread: 70,
			origin: { y: 0.5}, // Parte leggermente più in basso del centro
            zIndex: 9999        // Si assicura che sia sopra ogni cosa
		});
	}

    async function getTest() {
        let token = await getValidToken();

        const myHeaders = new Headers();
        myHeaders.append("X-Authorization", "Bearer " + token);

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

    async function getAiExplanation(questIndex) {
        showAiPopup = true;
        aiLoading = true;

        let token = await getValidToken();
        let question = answersToShow[questIndex];

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Authorization", "Bearer " + token);

        let userans;
        if(question.userAnswer == -1) {
            userans = "Risposta non data";
        } else {
            userans = question["ans_" + question.userAnswer]
        }

        const raw = JSON.stringify({
            "correct_ans": question["ans_" + question.correct_idx],
            "question": question.question,
            "question_id": question.id,
            "subject": question.subject,
            "user_ans": userans
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://www.basketscore.it/med-app/test/explainAi", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            aiResponse = JSON.parse(result).explanation;
            aiLoading = false;
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

    let answersToShow = $derived(
        subscriptionState.hasActiveSubscription 
            ? (data?.answers ?? []) 
            : (data?.answers?.slice(0, 8) ?? [])
    );

    function getSubjectName(n) {
        if(n == "fismat") {
            return "Fisica e matematica";
        } else if(n == "biologia") {
            return "Biologia";
        } else if(n == "mix") {
            return "Test misto";
        } else if(n == "chimica") {
            return "Chimica";
        } else if(n == "competenze") {
            return "Competenze";
        } else if(n == "logica") {
            return "Logica";
        } else if(n == "Fisica") {
            return "Fisica";
        }
    }

    onMount(() => {
        showLoading = true;
        getTest();
        partyBoom();
    });
</script>

<main class="p-6">
    <div class="flex justify-end">
        <button class="cursor-pointer p-1 bg-white dark:bg-[#222229] dark:border-[#28282f] dark:text-white flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors focus:ring-2 ring-gray-100" onclick={() => {goto('/home')}}><span class="material-symbols-rounded">close</span></button>
    </div>

    <div class="flex items-center justify-center px-4 py-1 w-fit text-sm bg-indigo-100 dark:bg-indigo-700/70 rounded-full text-indigo-800 dark:text-white border border-indigo-200 dark:border-indigo-600">
        {getSubjectName(data?.subject)}
    </div>
    <h1 class="text-4xl font-bold font-epilogue mt-4">Risultato test</h1>
    {#if data}
        <p class="text-gray-500 dark:text-gray-300">Il tuo test del {formatDate(data?.date)}</p>
    {/if}

    <div class="w-full bg-white dark:bg-[#222229] border border-gray-200 dark:border-[#28282f] rounded-xl p-6 mt-10">
        <div class="flex justify-between">
            <p class="font-epilogue font-semibold text-lg -mb-3">Punteggio totale</p>
            <span class="material-symbols-rounded text-gray-500 dark:text-gray-300 cursor-pointer select-none hover:scale-105 transition-transform" onclick={partyBoom}>celebration</span>
        </div>
        <div class="flex justify-between w-full items-baseline mb-4 mt-3">
            <p class="font-epilogue font-bold text-indigo-600 dark:text-indigo-500 h-15.5" style="font-size: 55px">{data?.score}%</p>
            <p class="text-gray-500 dark:text-gray-300 text-sm">100%</p>
        </div>

        <div class="w-full h-1.5 bg-indigo-200 rounded-xl">
            <div class="bg-indigo-600 dark:bg-indigo-500 h-full rounded-xl" style="width: {data?.score}%"></div>
        </div>

        <div class="flex justify-between w-full mt-8">
            <div class="w-1/3 flex flex-col items-start justify-center">
                <p class="text-emerald-600 font-bold text-2xl font-epilogue">{data?.correct_answers}</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">Corrette</p>
            </div>
            <div class="w-1/3 flex flex-col items-center justify-center">
                <p class="text-gray-600 dark:text-gray-400 font-bold text-2xl font-epilogue">{data?.notgiven_answers}</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">Non date</p>
            </div>
            <div class="w-1/3 flex flex-col items-end justify-center">
                <p class="text-red-600 font-bold text-2xl font-epilogue">{data?.wrong_answers}</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">Errate</p>
            </div>
        </div>
    </div>

    <div class="w-full bg-white border border-gray-200 dark:bg-[#222229] dark:border-[#28282f] rounded-xl p-6 mt-6">
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-2">Tempo impiegato</p>
        <p class="text-2xl font-semibold font-epilogue">{Math.floor(totaltime / 60) == 0 ? "" : Math.floor(totaltime / 60) + "m "} {totaltime > 59 ? totaltime % 60 + "s" : totaltime + "s"}</p> <!-- AGGIUNGI IMMAGINE A DESTRA, O LOGO TIPO CRONOMETRO O ICON CRONOMETRO ZOOMMATA IN 3D E PROSPETTIVA -->
    </div>
    
    <div class="w-full bg-white border border-gray-200 dark:bg-[#222229] dark:border-[#28282f] rounded-xl p-6 mt-3">
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-2">Tempo medio per domanda</p>
        <p class="text-gray-600 dark:text-gray-300"><span class="text-2xl font-semibold font-epilogue pr-2 text-black dark:text-white">{Math.floor(mediatime / 60) == 0 ? "" : Math.floor(mediatime / 60) + "m "} {mediatime > 59 ? mediatime % 60 + "s" : mediatime + "s"}</span></p>
    </div>

    <h3 class="text-xl font-epilogue font-semibold mt-10 mb-3">Risposte</h3>
    <div class="w-full flex flex-col gap-6">

        {#each answersToShow as ans, index}
            {#if ans.isCorrect === 0}
                <div class="answer-container w-full rounded-xl border border-red-200 dark:border-red-800">
                    <div class="text-red-500 bg-red-50 dark:bg-red-800/50 dark:text-red-200 rounded-tl-xl rounded-tr-xl flex items-center gap-1.5 py-2 px-4 border-b-1 border-red-200 dark:border-red-800">
                        <span class="material-symbols-rounded" style="font-size: 20px">cancel</span>
                        <p class="uppercase tracking-wide text-xs font-semibold">DOMANDA {index + 1}</p>
                    </div>
                    <div class="answer-container p-6 text-sm" class:blurred={!subscriptionState.hasActiveSubscription && index >= 5}>
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

                        {#if ans.img == 0}
                            <button class="flex items-center gap-1.5 mt-4" onclick={async () => {subscriptionState.hasActiveSubscription ? await getAiExplanation(index) : presentPaywall()}}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 fill-indigo-600" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 480.24"><path fill-rule="nonzero" d="M512 220.6c-163.88 61.72-149.02 38.94-206.92 208.29-57.91-169.35-43.06-146.57-206.92-208.26 163.86-61.72 149.01-38.95 206.92-208.3C362.98 181.68 348.12 158.91 512 220.6zM193.38 382.9c-76.59 28.86-69.65 18.21-96.71 97.34C69.63 401.11 76.59 411.76 0 382.9c76.59-28.81 69.63-18.15 96.67-97.31 27.06 79.16 20.12 68.5 96.71 97.31zm8.2-316.66c-52.13 19.66-47.41 12.38-65.81 66.28-18.43-53.86-13.69-46.62-65.84-66.28C122.08 46.63 117.34 53.87 135.77 0c18.4 53.87 13.68 46.63 65.81 66.24z"/></svg>
                                <p class="tracking-wide text-xs font-semibold text-indigo-500 underline">Spiega l'errore</p>
                            </button>
                        {/if}

                    </div>
                    {#if !subscriptionState.hasActiveSubscription && index === 5}
                    <div class="paywall-overlay">
                        <button class="rounded-xl px-4 py-2 text-sm bg-indigo-600 text-white font-semibold active:scale-101 transition-transform" onclick={presentPaywall}>
                            Sblocca tutte le risposte con Pro
                            </button>
                        </div>
                    {/if}
                </div>
            {:else if ans.isCorrect === 1}
                <div class="w-full rounded-xl border border-emerald-200 dark:border-emerald-800 blurred">
                    <div class="text-emerald-500 bg-emerald-50 dark:bg-emerald-800/60 dark:text-emerald-200 dark:border-emerald-800 rounded-tl-xl rounded-tr-xl flex items-center gap-1.5 py-2 px-4 border-b-1 border-emerald-200">
                        <span class="material-symbols-rounded" style="font-size: 20px">check_circle</span>
                        <p class="uppercase tracking-wide text-xs font-semibold">DOMANDA {index + 1}</p>
                    </div>
                    <div class="answer-container p-6 text-sm" class:blurred={!subscriptionState.hasActiveSubscription && index >= 5}>
                        <p>{ans.question}</p>
                        <div class="flex w-full justify-between gap-2 mt-4 border border-emerald-400 rounded-lg p-3">
                            <div class="flex w-full gap-2">
                                <span class="material-symbols-rounded w-fit text-emerald-500">radio_button_checked</span>
                                <p>{ans["ans_" + ans.userAnswer]}</p>
            
                            </div>
                            <span class="material-symbols-rounded text-emerald-500 w-fit ml-3">check</span>
                        </div>
                    </div>

                    {#if !subscriptionState.hasActiveSubscription && index === 5}
                        <div class="paywall-overlay">
                            <button class="rounded-xl px-4 py-2 text-sm bg-indigo-600 text-white font-semibold active:scale-101 transition-transform" onclick={presentPaywall}>
                                Sblocca tutte le risposte con Pro
                            </button>
                        </div>
                    {/if}
                </div>
            {/if}

        {/each}
    </div>
</main>

{#if showLoading}
    <LoadingScreen />
{/if}

{#if showAiPopup}
    <AiPopup loading={aiLoading} explanation={aiResponse} onClose={() => {showAiPopup = false}} />
{/if}


<style>
    .answer-container {
    position: relative;
    transition: filter 0.3s ease;
}

.answer-container.blurred {
    filter: blur(5px);
    pointer-events: none;
    user-select: none;
}

.paywall-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto; /* Il bottone sopra deve essere cliccabile */
}
</style>