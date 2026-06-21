<script>
    import BottomBar from "$lib/bottom-bar.svelte";
    import Navbar from "$lib/navbar.svelte";
    import Testcard from "$lib/test-card.svelte";
    import {onMount} from "svelte";


    import {user} from "$lib/user.svelte.js";
    import { activeTest } from "$lib/testState.svelte";
    import LoadingScreen from "$lib/loadingScreen.svelte";
    import { getValidToken } from "$lib/api";

    
    let token = $state(null);
    let tests = $state([]);
    let showLoading = $state(false);


    function getAllTests () {
        const myHeaders = new Headers();
        myHeaders.append("X-Authorization", "Bearer " + token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("https://www.basketscore.it/med-app/test/getAll", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            result = JSON.parse(result).data;
            console.log(result);

            tests = result;
            showLoading = false;
        }) 
        .catch((error) => console.error(error));
    }

    onMount(async () => {
        showLoading = true;
        token = await getValidToken();
        await getAllTests();
    })

</script>

<Navbar/>

<main class="p-6 mb-20">
    <h1 class="text-4xl font-bold font-epilogue mt-4">Storico test</h1>
    <p class="text-gray-500 dark:text-gray-400">Consulta i tuoi test passati e confronta i risultati ottenuti.</p>
    <div class="mt-6 flex flex-col gap-4">    
        
        {#each tests as test} 
            <Testcard materia={test.subject} superato={test.passed} data={test.date.split(" ")[0]} ora={test.date.split(" ")[1]} argomenti={test.arguments} perc={test.completion_percentage} id={test.id} completed={test.completed} nquestions={test.total_questions} nanswered={test.answered_questions} punteggio={test.score} ncorrect={test.correct_answers}/>
        {/each}
    </div>
</main>

<BottomBar page="history"/>

{#if showLoading}
    <LoadingScreen/>
{/if}