<script>
    import BottomBar from "$lib/bottom-bar.svelte";
    import Navbar from "$lib/navbar.svelte";
    import Testcard from "$lib/test-card.svelte";
</script>

<Navbar/>

<main class="p-6 mb-20 pt-20">
    <h1 class="text-7xl font-bold font-epilogue text-center">Sblocca il livello successivo</h1>
    <p class="text-xl font-semibold text-gray-500 text-center mt-6">Sblocca funzionalità avanzate e un'esperienza senza limiti.</p>

    <div class="lg:col-span-7 mt-16 bg-white rounded-xl border border-gray-200 p-10 relative overflow-hidden group hover:-translate-y-[1.5px] transition-all duration-300 shadow-sm hover:shadow-md hover:border-indigo-500 border-1 border-t-5 border-t-indigo-500">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-hover"></div>
        <div class="flex justify-between items-start mb-3xl gap-6">
            <div>
                <h2 class="font-bold font-epilogue text-3xl mb-1">Premium</h2>
                <p class="text-gray-500">Per un apprendimento di massima qualità.</p>
            </div>
            <div class="text-right">
                <div class="font-display text-[48px] leading-none tracking-tight">€49</div>
                <div class="text-sm text-gray-500 mt-xs">/ month</div>
            </div>
        </div>
        <hr class="h-px w-full border-gray-200 my-8" />
        <ul class="space-y-5 mb-6">
            <li class="flex items-start gap-3">
                <span class="material-symbols-rounded text-emerald-500 text-[20px] mt-[2px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <div>
                    <div class=" text-small text-text-primary font-semibold">Tutti gli argomenti</div>
                    <div class="text-sm text-gray-500">Esercitati su tutti gli argomenti dei tuoi test.</div>
                </div>
            </li>
                <li class="flex items-start gap-3">
                <span class="material-symbols-rounded text-emerald-500 text-[20px] mt-[2px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <div>
                    <div class="font-small text-small text-text-primary font-semibold">3200+ esercizi</div>
                    <div class="text-sm text-gray-500">Sblocca migliaia di domande differenti per allenarti su qualsiasi tipo di quesito.</div>
                </div>
            </li>
            <li class="flex items-start gap-3">
                <span class="material-symbols-rounded text-emerald-500 text-[20px] mt-[2px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <div>
                    <div class="font-small text-small text-text-primary font-semibold">Spiegazione degli errori </div>
                    <div class="text-sm text-gray-500">Ricevi spiegazioni con l'aiuto dell'AI per le risposte errate.</div>
                </div>
            </li>
            <li class="flex items-start gap-3">
                <span class="material-symbols-rounded text-emerald-500 text-[20px] mt-[2px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <div>
                    <div class="font-small text-small text-text-primary font-semibold">Ripassa test conclusi</div>
                    <div class="text-sm text-gray-500">Consulta i risultati dei tuoi vecchi test e ripassa gli argomenti su cui hai più difficoltà.</div>
                </div>
            </li>
        </ul>
        <button class="mt-4 w-full bg-white border-1 border-indigo-500 hover:bg-indigo-500 hover:text-white text-indigo-600 rounded-lg py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
            Upgrade Now
        </button>
    </div>
</main>

<BottomBar page='premium'/>