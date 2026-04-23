<script>
    import BottomBar from "$lib/bottom-bar.svelte";
    import Navbar from "$lib/navbar.svelte";
    import Testcard from "$lib/test-card.svelte";
</script>

<Navbar/>

<main class="p-6 mb-20">
    <h1 class="font-bold font-epilogue text-4xl mb-2 mt-4">Bentornato, Andre.</h1>
    <p class="text-gray-500">Dove eravamo rimasti?</p> <!-- qui potrebbero girare più frasi a rotazione, salvate in un json -->

    <div class="flex items-center w-full gap-1 bg-white px-4 py-2 border border-px border-gray-200 rounded-xl mt-3 mb-5">
        <span class="material-symbols-rounded text-orange-400" style="font-size: 28px; font-variation-settings: 'FILL' 1;">local_fire_department</span>
        <p class="text-sm">Streak di 12 giorni!</p>
    </div>

    <div class="bg-indigo-600 p-6 rounded-xl w-full text-white flex flex-col justify-between hover:scale-101 transition-transform">
        <div class="mb-20">
            <div class="flex items-center px-3 py-1 gap-2 bg-indigo-500 w-fit rounded-full tracking-wide text-sm border border-2 border-indigo-500 mb-5">
                <div class="size-2.5 bg-green-500 rounded-full"></div>
                <p>14% completato</p>
            </div>
            <h3 class="font-epilogue text-3xl font-semibold mb-2">Riprendi l'ultimo test</h3>
            <p class="font-light text-indigo-200/90">Chimica generale e analitica</p>
        </div>
        <div class="flex items-center justify-between w-full gap-6 text-indigo-200/90">
            <div class="w-full">
                <div class="flex items-center justify-between text-xs mb-1">
                    <p>12:11 rimanenti</p>
                    <p>3/20</p>
                </div>
                <div class="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                    <div class="bg-white h-full rounded-full" style="width: 14%;"></div>
                </div>
            </div>
            <div class="w-1/3 flex items-center justify-end gap-2 text-indigo-100 cursor-pointer">
                <p>Continua</p>
                <span class="material-symbols-rounded" style="font-size: 22px">arrow_forward</span>
            </div>
        </div>
    </div>

    <div class="w-full flex items-center justify-center flex-col bg-white rounded-xl px-6 py-8 border border-gray-200 cursor-pointer mt-6 hover:scale-101 transition-transform">
        <div class="p-4 bg-indigo-50 text-indigo-600 w-fit rounded-xl flex items-center justify-center">
            <span class="material-symbols-rounded" style="font-size: 28px">add</span>
        </div>
        <h3 class="font-medium font-epilogue text-xl mt-3">Avvia nuovo test</h3>
    </div>

    <div class="flex items-center justify-between mt-10">
        <h2 class="font-semibold text-2xl font-epilogue">Test completati</h2>
        <div class="flex items-center gap-1 justify-end text-sm text-indigo-600 cursor-pointer">
            <p class="hover:underline">Vedi tutti</p>
            <span class="material-symbols-rounded">arrow_forward</span>
        </div>
    </div>

    <div class="mt-3">
        <Testcard materia="Biologia" superato={true} data="23 aprile 2026" ora="22:18" argomenti={['Unità di misura', 'Molarità', 'Riduzione e ossidazione']} perc=65/>
    </div>
</main>

<BottomBar/>