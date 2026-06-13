<script>
    import { goto } from "$app/navigation";
    import { user } from "$lib/user.svelte.js";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { activeTest } from "$lib/testState.svelte";

    
    let checked = $state({
        fullTest: false,
        biologia: false,
        chimica: false,
        fismat: false,
        competenze: false,
        logica: false
    });

    // Variabile per salvare lo stato del test una volta ricevuto dal server
    let tests = $state(null);

    let showButton = $derived(Object.values(checked).some(val => val !== false))

    function calculateSubjects() {
        let chosenSubjects = [];

        // Se è selezionato il test completo, è automaticamente un mix di tutte le materie
        if(checked.fullTest) {
            return {
                type: "mix",
                subjects: ["biologia", "chimica", "logica", "fismat", "competenze"]
            };
        }

        if(checked.biologia) chosenSubjects.push("biologia");
        if(checked.chimica) chosenSubjects.push("chimica");
        if(checked.logica) chosenSubjects.push("logica");
        if(checked.fismat) chosenSubjects.push("fismat");
        if(checked.competenze) chosenSubjects.push("competenze");

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
        
        // Se ha scelto più di una materia singola, diventa un "mix" personalizzato
        return {
            type: "mix",
            subjects: chosenSubjects
        };
    }

    function createTest() {
        const config = calculateSubjects();
        
        if (config.type === "") {
            alert("Seleziona almeno una materia per iniziare il test!");
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("X-Authorization", "Bearer " + user.token);

        // Costruiamo i parametri da passare in GET (es: ?subject=mix&subjects[]=biologia&subjects[]=chimica)
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
    
</script>

<main class="p-6 mt-10 mb-12">
    <div class="flex items-center gap-1 mb-4 text-gray-700 cursor-pointer" onclick={() => {goto("/home")}}>
        <span class="material-symbols-rounded">arrow_back</span>
        <p>Torna alla home</p>
    </div>
    <h1 class="font-bold font-epilogue text-4xl">Nuovo test</h1>
    <p class="text-gray-600 mt-1 mb-6">Scegli se svolgere un test completo o selezionare gli argomenti su cui allenarti, poi avvia l'esercitazione.</p>

    <div class="w-full rounded-xl cursor-pointer relative hover:scale-101 tnransition-transform select-none" onclick={() => {checked.fullTest = !checked.fullTest}}>
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
            <p class="text-gray-500 text-sm">3347 domande. Fisica, Matematica, Biologia, Italiano.</p>
            <a href="" class="text-sm text-indigo-600 hover:underline">Vedi argomenti</a>
        </div>
        
    </div>
    
    <div class="w-full flex items-center gap-3 my-4">
        <span class="w-full border border-gray-300 dark:border-gray-700"></span>
        <p class="text-sm dark:text-gray-400">oppure</p>
        <span class="w-full border border-gray-300 dark:border-gray-700"></span>
    </div>

    <div class="w-full flex flex-col gap-6">

        <div class="w-full rounded-xl cursor-pointer relative hover:scale-101 transition-transform select-none" onclick={() => {checked.biologia = !checked.biologia}}>
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
                <p class="text-gray-500 text-sm">1190 domande</p>
                <a href="" class="text-sm text-indigo-600 hover:underline">Vedi argomenti</a>
            </div>
        </div>
        
        <div class="w-full rounded-xl cursor-pointer relative hover:scale-101 transition-transform select-none" onclick={() => {checked.fismat = !checked.fismat}}>
            {#if checked.fismat}
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
                <h3 class="text-lg font-semibold font-epilogue">Matematica e Fisica</h3>
                <p class="text-gray-500 text-sm">770 domande</p>
                <a href="" class="text-sm text-indigo-600 hover:underline">Vedi argomenti</a>
            </div>
        </div>

        <div class="w-full rounded-xl cursor-pointer relative hover:scale-101 transition-transform select-none mb-4" onclick={() => {checked.chimica = !checked.chimica}}>
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
                <p class="text-gray-500 text-sm">1015 domande</p>
                <a href="" class="text-sm text-indigo-600 hover:underline">Vedi argomenti</a>
            </div>
        </div>

        <div class="w-full rounded-xl cursor-pointer relative hover:scale-101 transition-transform select-none mb-4" onclick={() => {checked.logica = !checked.logica}}>
            {#if checked.logica}
                <div class="rounded-lg size-8 flex items-center justify-center bg-indigo-600 border-indigo-600 border text-white absolute top-4 right-4 select-none transition-all">
                    <span class="material-symbols-rounded">check</span>
                </div>
            {:else}
                <div class="rounded-lg size-8 flex items-center justify-center bg-white border-gray-200 border text-gray-400 absolute top-4 right-4 select-none transition-all">
                    <span class="material-symbols-rounded">check</span>
                </div>
            {/if}
            <img src="https://www.italiainminiatura.com/data/thumb_cache/_data_pagine_img_logica-mente-_npgtjq_jpg_cr_767_500.jpg" alt="" class="rounded-tl-xl rounded-tr-xl w-full h-36 object-cover">
            
            <div class="w-full bg-white dark:bg-gray-800 p-6 rounded-bl-xl rounded-br-xl">
                <h3 class="text-lg font-semibold font-epilogue">Logica</h3>
                <p class="text-gray-500 text-sm">280 domande</p>
                <a href="" class="text-sm text-indigo-600 hover:underline">Vedi argomenti</a>
            </div>
        </div>

        <div class="w-full rounded-xl cursor-pointer relative hover:scale-101 transition-transform select-none mb-4" onclick={() => {checked.competenze = !checked.competenze}}>
            {#if checked.competenze}
                <div class="rounded-lg size-8 flex items-center justify-center bg-indigo-600 border-indigo-600 border text-white absolute top-4 right-4 select-none transition-all">
                    <span class="material-symbols-rounded">check</span>
                </div>
            {:else}
                <div class="rounded-lg size-8 flex items-center justify-center bg-white border-gray-200 border text-gray-400 absolute top-4 right-4 select-none transition-all">
                    <span class="material-symbols-rounded">check</span>
                </div>
            {/if}
            <img src="https://pennablu.it/img/pagine-dizionario.jpg" alt="" class="rounded-tl-xl rounded-tr-xl w-full h-36 object-cover">
            
            <div class="w-full bg-white dark:bg-gray-800 p-6 rounded-bl-xl rounded-br-xl">
                <h3 class="text-lg font-semibold font-epilogue">Competenze</h3>
                <p class="text-gray-500 text-sm">245 domande</p>
                <a href="" class="text-sm text-indigo-600 hover:underline">Vedi argomenti</a>
            </div>
        </div>
    </div>

</main>

{#if showButton}
    <div class="w-screen bg-[#FAFAFA] dark:bg-[#1B1B23] fixed bottom-0 left-0 p-4 px-8 pb-8" transition:fly={{ y: 20, duration: 300, easing: cubicOut }}>
        <button class="bg-indigo-600 text-white w-full text-md font-semibold rounded-xl h-11 cursor-pointer" onclick={() => {createTest()}}>Inizia test</button>
    </div>
{/if}