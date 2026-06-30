<script>
    import BottomBar from "$lib/bottom-bar.svelte";
    import Navbar from "$lib/navbar.svelte";
    import Testcard from "$lib/test-card.svelte";
    import {user} from "$lib/user.svelte.js";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    import ChartComponent from './chart.svelte';

    import { goto } from "$app/navigation";
    import { getValidToken } from "$lib/api";

    function getName(fullName) {
        return fullName.split(" ")[0];
    }

    onMount(async () => {
        loading = true;
        token = await getValidToken();
        await getData();
    });

    let loading = $state(false);

    let data = $state(null);
    let chartData = $state([]);

    // --- CERCHIO ---
    let percentuale = $derived(data?.averageScore || 0);
    let dimensione = 120;
    let spessore = 12;
    let raggio = $derived((dimensione - spessore) / 2);
    let circonferenza = $derived(2 * Math.PI * raggio);
    let offset = $derived(circonferenza - (percentuale / 100) * circonferenza);

    // ----------------

    let token = $state(null)

    async function getData() {
        const myHeaders = new Headers();
        myHeaders.append("X-Authorization", "Bearer " + token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("https://www.basketscore.it/med-app/user/getHome", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            result = JSON.parse(result);

            data = result;

            for(let i=0; i<data.graph.length; i++) {
                chartData.push(data.graph[i].score);
            }

            chartData.reverse();
            console.log(chartData);
        })
        .catch((error) => console.error(error));
    }

    function openTest(id) {
        localStorage.setItem('lastTestId', id);
        console.log(id);
        goto(`/test`);
    }

    // --- CHART ---
    let chartConfig = $derived({
		labels: ['', '', '', '', '', ''],
		datasets: [
			{
				label: 'Punteggio',
				data: chartData,
				backgroundColor: 'rgba(79, 57, 246, 0.2)',
				borderColor: 'rgba(79, 57, 246, 1)',
				borderWidth: 2,
                tension: 0.2,
                fill: true,
                pointStyle: "circle"
			}
		]
	});
	
	let chartOptions = {
		responsive: true,
		maintainAspectRatio: true,
		plugins: {
			legend: {
                display: false
            },
            labels: {
                display: false
            }
		},
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false
                }
            }
        }
	};

    //-------------

    const materieMap = {
        chimica: { icon: "experiment", nome: "Chimica" },
        fismat: { icon: "function", nome: "Fisica e matematica" },
        biologia: { icon: "biotech", nome: "Biologia" },
        logica: { icon: "crossword", nome: "Logica" },
        competenze: { icon: "globe", nome: "Competenze" },
        mix: { icon: "shuffle", nome: "Test misto" }
    };
</script>

<Navbar/>

<main class="p-6 mb-20">
    <h1 class="font-bold font-epilogue text-3xl mb-2 mt-4">Bentornato, {user.userInfo ? getName(user.userInfo?.displayName) : ""}.</h1>
    <p class="text-gray-500 dark:text-gray-300">Dove eravamo rimasti?</p> <!-- qui potrebbero girare più frasi a rotazione, salvate in un json -->
    

    <!--<div class="flex items-center w-full gap-1 bg-white  px-4 py-2 border border-px border-gray-200 dark:bg-[#222229] dark:border-[#3b3b3f] rounded-xl mt-3 mb-5">
        <span class="material-symbols-rounded text-orange-400" style="font-size: 28px; font-variation-settings: 'FILL' 1;">local_fire_department</span>
        <p class="text-sm">Streak di 12 giorni!</p>
    </div> -->
    

    {#if !data}
        <div class="w-full h-40 bg-gray-200 dark:bg-[#25252f] mt-6 rounded-xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
    {/if}

    {#if data?.allTestCompleted == false}
    <div class="bg-indigo-600 p-6 mt-6 rounded-xl w-full text-white flex flex-col justify-between hover:scale-101 transition-transform" onclick={() => {openTest(data?.notCompleted.id)}}>
        <div class="mb-20">
            <div class="flex items-center px-3 py-1 gap-2 bg-indigo-500 w-fit rounded-full tracking-wide text-sm border border-2 border-indigo-500 mb-5">
                <div class="size-2.5 bg-green-500 rounded-full"></div>
                <p>{data?.notCompleted.completion_percentage}% completato</p>
            </div>
            <h3 class="font-epilogue text-2xl font-semibold mb-2">Riprendi l'ultimo test</h3>
            <p class="font-light text-indigo-200/90">{materieMap[data?.notCompleted.subject]?.nome}</p>
        </div>
        <div class="flex items-center justify-between w-full gap-6 text-indigo-200/90">
            <div class="w-full">
                <div class="flex items-center justify-between text-sm mb-1">
                    <p>{data?.notCompleted.total_questions - data?.notCompleted.answered_questions} rimanenti</p>
                    <p>{data?.notCompleted.answered_questions}/{data?.notCompleted.total_questions}</p>
                </div>
                <div class="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                    <div class="bg-white h-full rounded-full" style="width: {data?.notCompleted.completion_percentage}%;"></div>
                </div>
            </div>
            <div class="w-1/3 flex items-center justify-end gap-2 text-indigo-100 cursor-pointer">
                <p>Continua</p>
                <span class="material-symbols-rounded" style="font-size: 22px">arrow_forward</span>
            </div>
        </div>
    </div>

    {/if}

    {#if data?.allTestCompleted}
        <div class="w-full flex items-center justify-center flex-col bg-white dark:bg-[#222229] rounded-xl px-6 py-6 border border-gray-200 dark:border-[#3b3b3f] cursor-pointer mt-6 active:scale-101 transition-transform" onclick={() => {goto('/newtest')}} > 
            <div class="p-4 bg-indigo-50 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-400 w-fit rounded-xl flex items-center justify-center">
                <span class="material-symbols-rounded" style="font-size: 28px">add</span>
            </div>
            <h3 class="font-medium font-epilogue text-lg mt-3">Avvia nuovo test</h3>
        </div>
    {/if}

    {#if data}
        <div class="w-full flex items-center gap-3 mt-5 justify-center bg-white  dark:bg-[#222229] rounded-xl px-6 py-8 border border-gray-200 dark:border-[#3b3b3f] cursor-pointer active:scale-101 transition-transform" > 
            <div class="flex flex-col items-center gap-3 w-full">
                <p class="font-epilogue font-semibold text-gray-800 dark:text-white">Media</p>
                <div class="relative flex items-center justify-center" style="width: {dimensione}px; height: {dimensione}px; ">
                    <svg class="transform -rotate-90 w-full h-full">
                        <circle
                            cx={dimensione / 2}
                            cy={dimensione / 2}
                            r={raggio}
                            stroke="currentColor"
                            stroke-width={spessore}
                            fill="transparent"
                            class="text-gray-200"
                        />
                        <circle
                            cx={dimensione / 2}
                            cy={dimensione / 2}
                            r={raggio}
                            stroke="currentColor"
                            stroke-width={spessore}
                            fill="transparent"
                            stroke-dasharray={circonferenza}
                            stroke-dashoffset={offset}
                            stroke-linecap="round"
                            class="text-indigo-600 transition-all duration-500 ease-in-out"
                        />
                    </svg>

                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span class="text-xl font-semibold text-gray-800 dark:text-white">
                            {percentuale}%
                        </span>
                    </div>
                </div>
            </div>
            <div class="border-l border-px border-gray-300 h-[120px]"></div>
            <div class="w-full">
                <p class="text-gray-800 text-center font-epilogue font-semibold mb-3 dark:text-white">Completati</p>
                <div class="h-[120px] flex justify-center items-center w-full">
                    <p class="text-3xl font-bold text-gray-800 text-center dark:text-white">{data?.nCompleted}</p>
                </div>
            </div>
        </div>  
    {:else}
        <div class="w-full h-44 bg-gray-200 dark:bg-[#25252f] mt-6 rounded-xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
    {/if}

    {#if data}
        <div class="w-full flex items-center justify-center flex-col bg-white dark:bg-[#222229] rounded-xl px-6 py-8 border border-gray-200 dark:border-[#3b3b3f] cursor-pointer mt-6 active:scale-101 transition-transform" > 
            <p class="font-epilogue mb-2 font-semibold text-gray-800 dark:text-white">Punteggio ultimi test</p>
            <ChartComponent type="line" data={chartConfig} options={chartOptions} />
        </div> 
    {:else}
        <div class="w-full h-40 bg-gray-200 dark:bg-[#25252f] mt-6 rounded-xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
    {/if}
</main>

<BottomBar page='home'/>