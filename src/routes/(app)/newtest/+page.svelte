<script>
    import { goto } from "$app/navigation";
    import { user } from "$lib/user.svelte.js";
    import { fly, fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { activeTest } from "$lib/testState.svelte";
    import argumentsList from "./testArguments.json";
    import { getValidToken } from "$lib/api";
    import { subscriptionState, presentPaywall } from "$lib/revenuecat.svelte";
    import Card from "./subject-card.svelte";
    import { onMount } from "svelte";

    // Inizializziamo l'oggetto dello stato
    let checked = $state({
        fullTest: false
    });

    let loading = $state(false);

    let tests = $state(null);
    let phase = $state(0);
    let openArgumentsModal = $state(false);

    // Il derivato ora traccia correttamente i cambiamenti dell'intero oggetto checked
    let showButton = $derived(Object.values(checked).some(val => val === true));

    function toggleSelection(key) {
        if (key === 'fullTest') {
            if (!checked.fullTest) {
                // Se attivo il fullTest, resetto tutte le altre materie
                checked = { fullTest: true };
            } else {
                checked.fullTest = false;
            }
        } else {
            // Se seleziono una materia singola
            if (subscriptionState.hasActiveSubscription) {
                // Creiamo un nuovo oggetto per forzare la reattività di Svelte 5
                checked = {
                    ...checked,
                    fullTest: false,
                    [key]: !checked[key]
                };
            } else {
                presentPaywall();
            }
        }
    }

    function calculateSubjects() {
        let chosenSubjects = [];

        if (checked.fullTest) {
            let subjList = [];
            for(let i=0; i<availableSubjects.length; i++) {
                subjList.push(availableSubjects[i].id);
            }

            return {
                type: "mix",
                subjects: subjList
            };
        }

        Object.keys(checked).forEach(key => {
            if (key !== 'fullTest' && checked[key]) {
                chosenSubjects.push(key);
            }
        });

        if (chosenSubjects.length === 0) {
            return { type: "", subjects: [] };
        }

        if (chosenSubjects.length === 1) {
            return {
                type: chosenSubjects[0],
                subjects: chosenSubjects
            };
        } 

        console.log("CHOSEN SUBJECTS", chosenSubjects.toString());
        
        return {
            type: "mix",
            subjects: chosenSubjects
        };
    }

    async function createTest() {
        const config = calculateSubjects();
        let token = await getValidToken();
        
        if (config.type === "") {
            alert("Seleziona almeno una materia per iniziare il test!");
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("X-Authorization", "Bearer " + token);

        const params = new URLSearchParams();
        params.append("subject", config.type);
        config.subjects.forEach(sub => {
            params.append("subjects[]", sub);
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`https://www.basketscore.it/med-app/test/create?test=${chosenTestID}&${params.toString()}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if (result.success) {
                tests = result;
                localStorage.setItem('lastTestId', result.test_id);
                activeTest.reset();
                activeTest.id = result.test_id;
                activeTest.answers = result.answers;
                activeTest.currentIndex = 0;
                activeTest.totalQuestions = result.answers.length;
                goto('/test');
            }
        }) 
        .catch((error) => console.error(error));
    }

    async function getAvailableTests() {
        let token = await getValidToken();
        const myHeaders = new Headers();
        myHeaders.append("X-Authorization", "Bearer " + token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("https://www.basketscore.it/med-app/user/getAvailableTests", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            result = JSON.parse(result).data;
            availableTests = result;
            loading = false;
        })
        .catch((error) => console.error(error));
    }

    let availableTests = $state([]);
    let availableSubjects = $state([]);
    let chosenTestID = $state(null);

    function goNextPhase(chosenTestIndex) {
        chosenTestID = availableTests[chosenTestIndex].testId;
        availableSubjects = availableTests[chosenTestIndex].availableSubjects;
        phase = 1;
    }

    let argumentsToShow = $state(null);
    function showPopup(arg) {
        if(arg != "mix") {
            const subj = availableSubjects.find(subj => subj.id === arg);
            if (!subj) {
                console.error(`Materia con id "${arg}" non trovata.`);
                return;
            }

            let subjTopicsStr = subj.topics;
            let subjTopicsArr = subjTopicsStr.split(",");

            argumentsToShow = {
                subject: subj.name,
                sections: [
                    { title: null, items: subjTopicsArr || [] }
                ]
            };
        } else {
            let allTopics = [];

            for(let i=0; i<availableSubjects.length; i++){
                let subjTopicsStr = availableSubjects[i].topics;
                let subjTopicsArr = subjTopicsStr.split(",");


                allTopics.push({title: availableSubjects[i].name, items: subjTopicsArr});
            }

            argumentsToShow = {
                subject: "Tutte le materie",
                sections: allTopics
            };
        }
        openArgumentsModal = true;
    }

    onMount(async () => {
        loading = true;
        await getAvailableTests();
    }); 
</script>

<main class="p-6 mt-4 mb-12">
    <div class="flex items-center gap-1 mb-4 text-gray-700 dark:text-white cursor-pointer" onclick={() => {goto("/home")}}>
        <span class="material-symbols-rounded">arrow_back</span>
        <p class="">Torna alla home</p>
    </div>
    <h1 class="font-bold font-epilogue text-3xl">Nuovo test</h1>
    {#if phase == 0}
    <div>
        <p class="text-gray-600 dark:text-gray-300 mt-1 mb-6">Scegli per quale test allenarti</p>

        {#if loading}
            <div class="flex flex-col gap-4 w-full">
                <div class="w-full h-18 bg-gray-200 dark:bg-[#25252f] rounded-xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
                <div class="w-full h-18 bg-gray-200 dark:bg-[#25252f] rounded-xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
                <div class="w-full h-18 bg-gray-200 dark:bg-[#25252f] rounded-xl animate-pulse border border-gray-200 dark:border-gray-800" ></div>
            </div>
        {/if}

        <div class="flex flex-col gap-4 w-full">
            {#if availableTests}
                {#each availableTests as test, index}
                    <div class="bg-gray-50 dark:bg-[#222229] rounded-xl border border-gray-200 dark:border-[#3b3b3f] dark:text-white w-full p-3 flex justify-between items-center active:bg-gray-100 dark:active:bg-[#3b3b3f]" onclick={() => {goNextPhase(index)}}  transition:fade={{duration: 200}}>
                        <div class="flex gap-4 items-center">
                            <span class="material-symbols-rounded rounded-lg bg-indigo-500 p-2.5 dark:bg-indigo-400 text-white flex items-center justify-center" style="font-size: 27px">{test.icon}</span>
                            <p class="font-semibold">{test.name}</p>
                        </div>
                        <span class="material-symbols-rounded text-gray-700 dark:text-gray-300">keyboard_arrow_right</span>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
    {:else if phase == 1}
        {#if availableSubjects}
            <div>
                <p class="text-gray-600 dark:text-gray-300 mt-1 mb-6">Scegli se svolgere un test completo o selezionare gli argomenti su cui allenarti, poi avvia l'esercitazione.</p>

                <div class="w-full rounded-xl cursor-pointer relative hover:scale-101 transition-transform select-none" onclick={() => {toggleSelection('fullTest')}}>
                    {#if checked.fullTest}
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
                        <p class="text-gray-500 dark:text-gray-300 text-sm">2538 domande. Tutte le materie del test.</p>
                        <a href="" class="text-sm text-indigo-600 dark:text-indigo-400 active:underline" onclick={(event) => {event.preventDefault(); event.stopPropagation(); showPopup("mix");}}>Vedi argomenti</a>
                    </div>
                </div>        
                
                <div class="w-full flex items-center gap-3 my-4">
                    <span class="w-full border border-gray-300 dark:border-gray-700"></span>
                    <p class="text-sm dark:text-gray-300">oppure</p>
                    <span class="w-full border border-gray-300 dark:border-gray-700"></span>
                </div>

                <div class="w-full flex flex-col gap-6">
                    {#each availableSubjects as subj}
                        <Card 
                            name={subj.name} 
                            nquestions={subj.nQuestions} 
                            argument={subj.id} 
                            checked={!!checked[subj.id]} 
                            img={subj.img} 
                            toggleSelection={toggleSelection}
                            showPopup={showPopup}
                        />
                    {/each}
                </div>
            </div>
        {/if}
    {/if}
</main>

{#if argumentsToShow && openArgumentsModal}
    <div 
        class="fixed inset-0 z-[999] flex h-screen w-screen items-end justify-center bg-black/40" 
        onclick={() => {openArgumentsModal = false}}
        
        
        onwheel={(e) => e.preventDefault()}
        ontouchmove={(e) => { if(e.target === e.currentTarget) e.preventDefault(); }}
    >
        
        <div 
            class="flex w-full max-h-[90vh] flex-col rounded-t-[26px] bg-white dark:bg-gray-700 dark:text-white p-5 pb-[calc(env(safe-area-inset-bottom)+32px)] shadow-[0_-5px_20px_rgba(0,0,0,0.15)]" 
            transition:fly={{ y: 500, duration: 400, easing: cubicOut }} 
            onclick={(e) => e.stopPropagation()}
        >
            <div class="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            
            <p class="text-xl font-epilogue font-semibold text-gray-900 dark:text-white shrink-0">Argomenti</p>
            <p class="text-gray-500 dark:text-gray-300 mb-4 shrink-0">{argumentsToShow.subject}</p>
            
            <div class="flex-1 overflow-y-auto overscroll-contain pr-1 space-y-4">
                {#each argumentsToShow.sections as section}
                    <div>
                        {#if section.title}
                            <p class="font-bold text-gray-800 dark:text-gray-200 mb-2">{section.title}</p>
                        {/if}
                        <ul class="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                            {#each section.items as item}
                                <li>{item}</li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>

            <button 
                class="w-full shrink-0 rounded-2xl bg-indigo-600 dark:bg-indigo-500 p-3 font-semibold text-white transition-colors active:bg-indigo-700 dark:active:bg-indigo-600 mt-4" 
                onclick={() => {openArgumentsModal = false}}>
                Chiudi
            </button> 
        </div>

    </div>
{/if}


{#if showButton}
    <div class="w-screen bg-[#FAFAFA] dark:bg-[#1B1B23] fixed bottom-0 left-0 p-4 px-8 pb-[calc(env(safe-area-inset-bottom)+32px)]" transition:fly={{ y: 20, duration: 300, easing: cubicOut }}>
        <button class="bg-indigo-600 text-white w-full text-md font-semibold rounded-xl h-11 cursor-pointer" onclick={() => {createTest()}}>Inizia test</button>
    </div>
{/if}