<script>
    import { render } from "svelte/server";
    import { goto } from "$app/navigation";
    import { activeTest } from "$lib/testState.svelte";
    import { onMount } from "svelte";
    import { user } from "$lib/user.svelte";
    import LoadingScreen from '$lib/loadingScreen.svelte';
    import { documentMatches } from "firebase/firestore/pipelines";
    import { getValidToken } from "$lib/api";

    let openCloseModal = $state(false);
    let showLoading = $state(false);
    let currentQuestionId = $state(0);

    let UIselectedAnswer = $state(-1);
    let indexSelectedAnswer = $state(-1);

    let currentTestId = $state(localStorage.getItem('lastTestId'));

    let currentHasImg = $derived(activeTest?.answers?.[currentQuestionId]?.img);
    let imageUrl = $derived.by(() => {
        const currentQuestion = activeTest?.answers?.[currentQuestionId];
        if (currentQuestion?.img == 1) {
            const tableToPrefix = {
                "quiz_biologia": "bio",
                "quiz_chimica": "chim",
                "quiz_fismat": "mate",
                "quiz_logica": "log"
            };

            const prefix = tableToPrefix[currentQuestion.subject] || "";
            const number = currentQuestion.questionId;

            return `https://www.basketscore.it/med-app/images/${prefix}_${number}.jpg`;
        }

        return null;
    });

    let totalQuestions = $derived(activeTest?.totalQuestions || 0);
    let percentage = $derived(totalQuestions > 0 ? ((currentQuestionId + 1) / totalQuestions * 100) : 0);

    let options = $derived([
        { id: 'A', text: activeTest.answers?.[currentQuestionId]?.ans_0 },
        { id: 'B', text: activeTest.answers?.[currentQuestionId]?.ans_1 },
        { id: 'C', text: activeTest.answers?.[currentQuestionId]?.ans_2 },
        { id: 'D', text: activeTest.answers?.[currentQuestionId]?.ans_3 },
        { id: 'E', text: activeTest.answers?.[currentQuestionId]?.ans_4 }
    ]);

    function renderApici(testo) {
        return testo?.replace(/\^([0-9\-\–\—\/]+)/g, '<sup>$1</sup>');
    }

    let text = $derived(renderApici(activeTest?.answers?.[currentQuestionId]?.question));

    function handleSelect(index, id) {
        indexSelectedAnswer = index;
        UIselectedAnswer = id;
    }

    let token = $state(null);
    
    onMount(async () => {
        showLoading = true;
        token = await getValidToken();
        getTest();
        startInterval();
    });

    $effect(() => {
        console.log(activeTest.answers?.[currentQuestionId]);
    });

    function sendAnswer() {
        if(UIselectedAnswer != null && indexSelectedAnswer != null) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("X-Authorization", "Bearer " + token);

            const raw = JSON.stringify({
                "questionId": activeTest?.answers?.[currentQuestionId]?.questionId,
                "fromTable": activeTest?.answers?.[currentQuestionId]?.subject,
                "testId": currentTestId,
                "time": seconds,
                "answer": indexSelectedAnswer
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("https://www.basketscore.it/med-app/test/updateQuestion", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                result = JSON.parse(result);

                if(result.success) {
                    if(currentQuestionId < totalQuestions - 1) {
                        currentQuestionId++;
                        UIselectedAnswer = -1;
                        indexSelectedAnswer = -1;
                        seconds = 0;
                    } else {
                        endTest();
                    }
                }
            })
            .catch((error) => console.error(error));
        }
    }

    function getTest() {
        const myHeaders = new Headers();
        myHeaders.append("X-Authorization", "Bearer " + token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("https://www.basketscore.it/med-app/test/get?testid=" + currentTestId, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            result = JSON.parse(result).data;
            activeTest.answers = result.answers;
            activeTest.id = result.id;
            activeTest.totalQuestions = result.totalQuestions;
        
            if(activeTest?.answers.length > 0) {
                currentQuestionId = -1;
                for(let i=0; i<activeTest?.answers.length; i++) {
                    if(activeTest.answers[i].userAnswer == null) {
                        currentQuestionId = i;
                        console.log(currentQuestionId);
                        break;
                    }
                }

                showLoading = false;

                if(currentQuestionId == -1) {
                    endTest();
                }
            } 
            
        })
        .catch((error) => console.error(error));
    }

    function endTest() {
        showLoading = true;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Authorization", "Bearer " + token);

        const raw = JSON.stringify({
            "testId": currentTestId
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://www.basketscore.it/med-app/test/end", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            result = JSON.parse(result);

            if(result.success) {
                showLoading = false;
                goto("/result");
            }
        })
        .catch((error) => console.error(error));
    }

    function previousAnswer() {
        if (currentQuestionId > 0) {
            currentQuestionId--; 
            const savedAnswerIndex = activeTest?.answers?.[currentQuestionId]?.userAnswer;
            
            if (savedAnswerIndex != null) {
                indexSelectedAnswer = savedAnswerIndex;
                
                const letters = ['A', 'B', 'C', 'D', 'E'];
                UIselectedAnswer = letters[savedAnswerIndex] || -1;
            } else {
                indexSelectedAnswer = -1;
                UIselectedAnswer = -1;
            }
        }
    }
 
    let seconds = $state(0);
    let interval = $state(null);

    let startInterval = ()=>{
            clearInterval(interval)
                interval = setInterval(()=> {
            seconds++
            //console.log(seconds)
        }, 1000)
	};

</script>

<div class="w-screen h-1.5 bg-indigo-200 fixed top-0 left-0 rounded-br-xl rounded-bl-xl">
    <div class="bg-indigo-600 h-full rounded-br-xl rounded-bl-xl" style="width: {percentage}%"></div>
</div>

<main class="p-6 pt-8">
    <div class="w-full flex items-center justify-between mb-12">
        <div class="flex w-fit items-center justify-center shadow-xs gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 dark:bg-[#393941] dark:border-[#59595e] dark:text-white"> 
            <div class="flex items-center justify-between gap-2">
                <span class="material-symbols-rounded" style="font-variation-settings: 'FILL' 1;">timer</span>
                <p>{seconds > 59 ? (Math.floor(seconds/60)<10 ? "0" + Math.floor(seconds/60) : Math.floor(seconds/60)) : "00"}:{seconds%60 < 10 ? "0" + seconds%60 : seconds%60}</p>
            </div>
        </div>
        <button class="cursor-pointer p-1 bg-white flex items-center justify-center rounded-xl border border-gray-200 active:bg-gray-100 dark:bg-[#393941] dark:active:bg-[#42424c] dark:border-[#59595e] transition-colors focus:ring-2 ring-gray-100" onclick={() => {openCloseModal = true;}}><span class="material-symbols-rounded">close</span></button>
    </div>

    <h1 class="text-3xl font-semibold font-epilogue">{@html text}</h1>

    {#if currentHasImg === 1}
        <div class="w-full mt-6 flex justify-center bg-white dark:bg-[#393941] p-2 rounded-xl border border-gray-200 dark:border-[#59595e] shadow-xs">
            <img 
                src={imageUrl} 
                alt="Immagine del quesito" 
                class="max-h-80 w-auto object-contain rounded-lg" 
            />
        </div>
    {/if}

    <div class="w-full mt-15 flex flex-col gap-3">
        {#each options as option, index}
            <div 
                onclick={() => handleSelect(index, option.id)}
                class="p-6 rounded-xl border w-full flex items-center justify-between gap-5 cursor-pointer transition-colors {UIselectedAnswer === option.id ? 'border-indigo-600 bg-indigo-100 shadow-md active:bg-indigo-200 dark:bg-indigo-600 dark:active:bg-indigo-500' : 'border-gray-200 bg-white active:bg-gray-100 dark:bg-[#393941] dark:active:bg-[#42424c] dark:border-[#59595e]'}"
            >
                <div class="flex items-center gap-5">
                    <span class="p-2.5 px-4 flex items-center justify-center border rounded-xl {UIselectedAnswer === option.id ? 'bg-indigo-600 dark:text-indigo-600 dark:bg-white text-white' : ' border-gray-200'}">
                        {option.id}
                    </span>
                    <p>{option.text}</p>
                </div>
                
                {#if UIselectedAnswer === option.id}
                    <span class="material-symbols-rounded text-indigo-600 dark:text-white" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                {/if}
            </div>
        {/each}
    </div>

    <div class="flex w-full justify-between items-center my-10">
        <p class="text-sm text-gray-500 font-medium uppercase tracking-wider">Domanda {currentQuestionId + 1} di {totalQuestions}</p>
        <div class="flex items-center gap-2">
            <button class="bg-[#FAFAFA] dark:bg-[#1B1B23] rounded-xl px-6 py-1.5 text-indigo-500 dark:text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-indigo-700 cursor-pointer focus:ring-2 ring-indigo-300 border-2 border-indigo-300 w-8" onclick={() => {previousAnswer()}}><span class="material-symbols-rounded">arrow_back</span></button>
            <button class="bg-indigo-600 rounded-xl px-6 py-2 text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-indigo-700 cursor-pointer focus:ring-3 ring-indigo-300" onclick={() => {sendAnswer()}}>Prossima <span class="material-symbols-rounded">arrow_forward</span></button>
        </div>
    </div>
</main>

<div class="w-screen h-screen flex items-center justify-center bg-black/60 top-0 left-0" class:fixed={openCloseModal} class:hidden={!openCloseModal}>
    <div class="bg-white dark:bg-[#393941] rounded-xl w-[80%] p-8 max-w-125">
        <span class="material-symbols-rounded text-red-500 mb-2" style="font-variation-settings: 'FILL' 1; font-size: 50px">error</span>
        <p class="text-lg font-epilogue font-semibold">Tornare alla home?</p>
        <p class="text-gray-500 dark:text-gray-300">I tuoi progressi verranno salvati e potrai riprendere questo test in qualsiasi momento.</p>
        <div class="mt-4">
            <button class="border border-red-500 px-5 py-2 rounded-xl text-red-600 dark:text-red-500 font-semibold mr-2 cursor-pointer" onclick={() => {openCloseModal = false;}}>Annulla</button>
            <button class="border border-red-500 bg-red-500 px-5 py-2 rounded-xl text-white font-semibold cursor-pointer"  onclick={() => {openCloseModal = false; goto("/home")}}>Conferma</button>
        </div>
    </div>
</div>

{#if showLoading}
    <LoadingScreen />
{/if}