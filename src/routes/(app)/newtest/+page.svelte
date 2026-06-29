<script>
    import { goto } from "$app/navigation";
    import { user } from "$lib/user.svelte.js";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { activeTest } from "$lib/testState.svelte";
    import argumentsList from "./testArguments.json";
    import { getValidToken } from "$lib/api";
    import { subscriptionState, presentPaywall } from "$lib/revenuecat.svelte";
    import Card from "./newtest-card.svelte";
    import { onMount } from "svelte";

    
    let checked = $state({
        fullTest: false,
        biologia: false,
        chimica: false,
        fisica: false
    });

    // Variabile per salvare lo stato del test una volta ricevuto dal server
    let tests = $state(null);
    let phase = $state(0);

    let openArgumentsModal = $state(false);

    let showButton = $derived(Object.values(checked).some(val => val !== false));

    function toggleSelection(key) {
        if (key === 'fullTest') {
            // Se sto attivando il fullTest, disattivo tutto il resto
            if (!checked.fullTest) {
                checked = {
                    fullTest: true,
                    biologia: false,
                    chimica: false,
                    fisica: false
                };
            } else {
                checked.fullTest = false;
            }
        } else {
            // Se sto cliccando una materia, disattivo il fullTest
            if(subscriptionState.hasActiveSubscription) {
                checked.fullTest = false;
                checked[key] = !checked[key];
            } else {
                presentPaywall();
            }
        }
    }

    function calculateSubjects() {
        let chosenSubjects = [];

        if(checked.fullTest) {
            return {
                type: "mix",
                subjects: ["biologia", "chimica", "fisica"]
            };
        }

        if(checked.biologia) chosenSubjects.push("biologia");
        if(checked.chimica) chosenSubjects.push("chimica");
        if(checked.fisica) chosenSubjects.push("fisica");

        // Se non è stato selezionato nulla
        if (chosenSubjects.length === 0) {
            return { type: "", subjects: [] };
        }

        // Se ha scelto una sola materia
        if(chosenSubjects.length === 1) {
            return {
                type: chosenSubjects[0],
                subjects: chosenSubjects
            };
        } 
        
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

        // Aggreghiamo i parametri all'URL
        fetch(`https://www.basketscore.it/med-app/test/create?${params.toString()}`, requestOptions)
        .then((response) => response.json()) // Modificato in .json() visto che rispondi in JSON
        .then((result) => {
            
            
            if (result.success) {
                tests = result;
                localStorage.setItem('lastTestId', result.test_id);
                activeTest.reset();
                activeTest.id = result.test_id;
                activeTest.answers = result.answers;
                activeTest.currentIndex = 0;
                activeTest.totalQuestions = result.answers.length;
                

                //console.log(activeTest);
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
        })
        .catch((error) => console.error(error));
    }
    let availableTests = $state([]);

    let testSubjects = $state([]);

    function goNextPhase(chosenTestIndex) {
        let strSubjects = availableTests[chosenTestIndex].subjects;

        testSubjects = strSubjects.split(",");

        phase = 1;
    }

    let argumentsToShow = $state(null);
    function showPopup(arg) {
        if (arg !== "fismat") {
            argumentsToShow = {
                subject: arg,
                sections: [
                    { title: null, items: argumentsList[arg] }
                ]
            };
        } else {
            argumentsToShow = {
                subject: "Fisica e matematica",
                sections: [
                    { title: "Fisica", items: argumentsList["fisica"] },
                    { title: "Matematica", items: argumentsList["matematica"] }
                ]
            };
        }
        openArgumentsModal = true;
    }

    onMount(async () => {
        await getAvailableTests();
    }); 
    
</script>

<main class="p-6 mt-4 mb-12">
    <div class="flex items-center gap-1 mb-4 text-gray-700 dark:text-white cursor-pointer" onclick={() => {goto("/home")}}>
        <span class="material-symbols-rounded">arrow_back</span>
        <p class="">Torna alla home</p>
    </div>
    <h1 class="font-bold font-epilogue text-4xl">Nuovo test</h1>
    {#if phase == 0}
    <div>
        <p class="text-gray-600 dark:text-gray-300 mt-1 mb-6">Scegli per quale test allenarti</p>

        <div class="flex flex-col gap-4 w-full">
            {#if availableTests}
                {#each availableTests as test, index}
                    <div class="bg-gray-50 dark:bg-[#222229] rounded-xl border border-gray-100 dark:border-[#3b3b3f] dark:text-white w-full p-3 flex justify-between items-center active:bg-gray-100 dark:active:bg-[#3b3b3f]" onclick={() => {goNextPhase(index)}}>
                        <div class="flex gap-4 items-center">
                            <span class="material-symbols-rounded rounded-lg bg-indigo-500 p-2.5 dark:bg-indigo-400 text-white flex items-center justify-center" style="font-size: 27px">{test.icon}</span>
                            <p class="font-semibold">{test.name}</p>
                        </div>
                        <span class="material-symbols-rounded text-white dark:text-gray-300">keyboard_arrow_right</span>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
    {:else if phase == 1}
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
                <p class="text-gray-500 dark:text-gray-300 text-sm">2538 domande. Fisica, Biologia e Chimica.</p>
                <a href="" class="text-sm text-indigo-600 dark:text-indigo-400 active:underline" onclick={(event) => {event.preventDefault(); event.stopPropagation(); showPopup("mix");}}>Vedi argomenti</a>
            </div>
            
        </div>

        <!-- <Card name="Test completo" nquestions=2538 subjects="Fisica, Biologia e Chimica" argument="fullTest" checked={checked.fullTest} />-->
        
        
        <div class="w-full flex items-center gap-3 my-4">
            <span class="w-full border border-gray-300 dark:border-gray-700"></span>
            <p class="text-sm dark:text-gray-300">oppure</p>
            <span class="w-full border border-gray-300 dark:border-gray-700"></span>
        </div>

        <div class="w-full flex flex-col gap-6">

            {#if testSubjects}
                {#each testSubjects as subj}
                    <Card name={subj.name} nquestions={subj.nQuestions} argument={subj.subjectId} checked={checked[subj.subjectId]} img={subj.img}/>
                {/each}
            {/if}

            <!-- <div class="w-full rounded-xl cursor-pointer relative hover:scale-101 transition-transform select-none" onclick={() => {toggleSelection('biologia')}}>
                {#if !subscriptionState.hasActiveSubscription} 
                    <div class="rounded-lg flex items-center justify-center text-xs px-2.5 py-0.5 font-medium bg-indigo-600 border-indigo-600 border text-white absolute top-4 left-4 select-none">
                        Disponibile con Pro
                    </div>
                {/if}
                
                {#if checked.biologia}
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
                    <p class="text-gray-500 dark:text-gray-300 text-sm">1223 domande</p>
                    <a href="" class="text-sm text-indigo-600 dark:text-indigo-400 active:underline" onclick={(event) => {event.preventDefault(); event.stopPropagation(); showPopup("biologia");}}>Vedi argomenti</a>
                </div>
            </div>
            
            <div class="w-full rounded-xl cursor-pointer relative hover:scale-101 transition-transform select-none" onclick={() => {toggleSelection('fisica')}}>
                {#if !subscriptionState.hasActiveSubscription} 
                    <div class="rounded-lg flex items-center justify-center text-xs px-2.5 py-0.5 font-medium bg-indigo-600 border-indigo-600 border text-white absolute top-4 left-4 select-none">
                        Disponibile con Pro
                    </div>
                {/if}
                
                {#if checked.fisica}
                    <div class="rounded-lg size-8 flex items-center justify-center bg-indigo-600 border-indigo-600 border text-white absolute top-4 right-4 select-none transition-all">
                        <span class="material-symbols-rounded">check</span>
                    </div>
                {:else}
                    <div class="rounded-lg size-8 flex items-center justify-center bg-white border-gray-200 border text-gray-400 absolute top-4 right-4 select-none transition-all">
                        <span class="material-symbols-rounded">check</span>
                    </div>
                {/if}
                <img src="https://img.magnific.com/foto-gratuito/tavola-incisa-con-formule-e-calcoli-scientifici_1150-19413.jpg?semt=ais_hybrid&w=740&q=80" alt="" class="rounded-tl-xl rounded-tr-xl w-full h-36 object-cover">
                
                <div class="w-full bg-white dark:bg-gray-800 p-6 rounded-bl-xl rounded-br-xl">
                    <h3 class="text-lg font-semibold font-epilogue">Fisica</h3>
                    <p class="text-gray-500 dark:text-gray-300 text-sm">466 domande</p>
                    <a href="" class="text-sm text-indigo-600 dark:text-indigo-400 active:underline" onclick={(event) => {event.preventDefault(); event.stopPropagation(); showPopup("fisica");}}>Vedi argomenti</a>
                </div>
            </div>

            <div class="w-full rounded-xl cursor-pointer relative hover:scale-101 transition-transform select-none mb-4" onclick={() => {toggleSelection('chimica')}}>
                {#if !subscriptionState.hasActiveSubscription} 
                    <div class="rounded-lg flex items-center justify-center text-xs px-2.5 py-0.5 font-medium bg-indigo-600 border-indigo-600 border text-white absolute top-4 left-4 select-none">
                        Disponibile con Pro
                    </div>
                {/if}
                
                {#if checked.chimica}
                    <div class="rounded-lg size-8 flex items-center justify-center bg-indigo-600 border-indigo-600 border text-white absolute top-4 right-4 select-none transition-all">
                        <span class="material-symbols-rounded">check</span>
                    </div>
                {:else}
                    <div class="rounded-lg size-8 flex items-center justify-center bg-white border-gray-200 border text-gray-400 absolute top-4 right-4 select-none transition-all">
                        <span class="material-symbols-rounded">check</span>
                    </div>
                {/if}
                <img src="https://www.maja.it/wp-content/uploads/2019/07/shutterstock_446601703.jpg" alt="" class="rounded-tl-xl rounded-tr-xl w-full h-36 object-cover">
                
                <div class="w-full bg-white dark:bg-gray-800 p-6 rounded-bl-xl rounded-br-xl">
                    <h3 class="text-lg font-semibold font-epilogue">Chimica</h3>
                    <p class="text-gray-500 dark:text-gray-300 text-sm">1131 domande</p>
                    <a href="" class="text-sm text-indigo-600 dark:text-indigo-400 active:underline" onclick={(event) => {event.preventDefault(); event.stopPropagation(); showPopup("chimica");}}>Vedi argomenti</a>
                </div>
            </div>-->
        </div>
    </div>
    {/if}

</main>

{#if argumentsToShow}
<div class="w-screen h-screen flex items-center z-50 justify-center bg-black/60 top-0 left-0" class:fixed={openArgumentsModal} class:hidden={!openArgumentsModal}>
    <div class="bg-white dark:bg-[#393941] rounded-xl w-[80%] p-8 max-w-125 max-h-[90vh] overflow-y-auto">
        <p class="text-lg font-epilogue font-semibold text-gray-900 dark:text-white">Argomenti</p>
        <p class="text-gray-500 dark:text-gray-300 capitalize mb-4">{argumentsToShow.subject}</p>
        
        <div class="flex flex-col gap-4">
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

        <div class="mt-6 flex justify-end">
            <button 
                class="border border-indigo-500 px-5 py-1.5 rounded-xl text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" 
                onclick={() => {openArgumentsModal = false;}}
            >
                Chiudi
            </button>
        </div>
    </div>
</div>
{/if}

{#if showButton}
    <div class="w-screen bg-[#FAFAFA] dark:bg-[#1B1B23] fixed bottom-0 left-0 p-4 px-8 pb-[calc(env(safe-area-inset-bottom)+32px)]" transition:fly={{ y: 20, duration: 300, easing: cubicOut }}>
        <button class="bg-indigo-600 text-white w-full text-md font-semibold rounded-xl h-11 cursor-pointer" onclick={() => {createTest()}}>Inizia test</button>
    </div>
{/if}