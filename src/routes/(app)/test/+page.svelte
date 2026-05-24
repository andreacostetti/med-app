<script>
    import { render } from "svelte/server";
    import { goto } from "$app/navigation";


    let openCloseModal = $state(false);

    function renderApici(testo) {
		// Questa regex ora accetta sia il trattino normale - che quelli lunghi – e —
		return testo.replace(/\^([0-9\-\–\—\/]+)/g, '<sup>$1</sup>');
	}

    let text = renderApici("");

</script>

<div class="w-screen h-1.5 bg-indigo-200 fixed top-0 left-0 rounded-br-xl rounded-bl-xl">
    <div class="bg-indigo-600 w-[65%] h-full rounded-br-xl rounded-bl-xl"></div>
</div>


<main class="p-6 pt-8">
    <div class="w-full flex items-center justify-between mb-12">
        <div class="flex w-fit items-center justify-center shadow-xs gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 dark:bg-[#393941] dark:border-[#59595e] dark:text-white"> 
            <div class="flex items-center justify-between gap-2">
                <span class="material-symbols-rounded" style="font-variation-settings: 'FILL' 1;">timer</span>
                <p>12:45</p>
            </div>
        </div>
        <button class="cursor-pointer p-1 bg-white flex items-center justify-center rounded-xl border border-gray-200 active:bg-gray-100 dark:bg-[#393941] dark:active:bg-[#42424c] dark:border-[#59595e] transition-colors focus:ring-2 ring-gray-100" onclick={() => {openCloseModal = true;}}><span class="material-symbols-rounded">close</span></button>
    </div>

    <h1 class="text-3xl font-semibold font-epilogue">{@html text}</h1>

    <div class="w-full mt-20 flex flex-col gap-3">
        <div class="p-6 rounded-xl border border-gray-200 w-full flex items-center gap-5 bg-white cursor-pointer active:bg-gray-100 dark:active:bg-[#42424c] dark:bg-[#393941] dark:border-[#59595e] transition-colors">
            <span class="p-2.5 px-4 flex items-center justify-center rounded-xl border border-gray-200">A</span>
            <p>Xenon</p>
        </div>
        <div class="p-6 rounded-xl border border-indigo-600 w-full flex items-center justify-between gap-5 bg-indigo-100 shadow-md cursor-pointer active:bg-indigo-200 dark:bg-indigo-600 dark:active:bg-indigo-500 transition-colors">
            <div class="flex items-center gap-5">
                <span class="p-2.5 px-4 flex items-center justify-center rounded-xl bg-indigo-600 dark:text-indigo-600 dark:bg-white text-white">B</span>
                <p>Argon</p>
            </div>
            <span class="material-symbols-rounded text-indigo-600 dark:text-white " style="font-variation-settings: 'FILL' 1;">check_circle</span>
        </div>
        <div class="p-6 rounded-xl border border-gray-200 w-full flex items-center gap-5 bg-white cursor-pointer active:bg-gray-100 dark:bg-[#393941] dark:active:bg-[#42424c] dark:border-[#59595e] transition-colors">
            <span class="p-2.5 px-4 flex items-center justify-center rounded-xl border border-gray-200">C</span>
            <p>Neon</p>
        </div>
        <div class="p-6 rounded-xl border border-gray-200 w-full flex items-center gap-5 bg-white cursor-pointer active:bg-gray-100 dark:bg-[#393941] dark:active:bg-[#42424c] dark:border-[#59595e] transition-colors">
            <span class="p-2.5 px-4 flex items-center justify-center rounded-xl border border-gray-200">D</span>
            <p>Elio</p>
        </div>
        <div class="p-6 rounded-xl border border-gray-200 w-full flex items-center gap-5 bg-white cursor-pointer active:bg-gray-100 dark:bg-[#393941] dark:active:bg-[#42424c] dark:border-[#59595e] transition-colors">
            <span class="p-2.5 px-4 flex items-center justify-center rounded-xl border border-gray-200">E</span>
            <p>Radon</p>
        </div>
    </div>

    <div class="flex w-full justify-between items-center my-10">
        <p class="text-sm text-gray-500 font-medium uppercase tracking-wider">Domanda 4 di 20</p>
        <button class="bg-indigo-600 rounded-xl px-6 py-2 text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-indigo-700 cursor-pointer focus:ring-3 ring-indigo-300">Prossima <span class="material-symbols-rounded">arrow_forward</span></button>
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