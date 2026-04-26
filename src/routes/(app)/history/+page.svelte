<script>
    import BottomBar from "$lib/bottom-bar.svelte";
    import Navbar from "$lib/navbar.svelte";
    import Testcard from "$lib/test-card.svelte";
</script>

<Navbar/>

<main class="p-6 mb-20">
    <h1 class="text-4xl font-bold font-epilogue mt-4">Storico test</h1>
    <p class="text-gray-500">Consulta i tuoi test passati e confronta i risultati ottenuti.</p>
    <div class="mt-6 flex flex-col gap-4">
        <Testcard materia="Biologia" superato={true} data="23 aprile 2026" ora="22:18" argomenti={['Unità di misura', 'Molarità', 'Riduzione e ossidazione']} perc=65/>
    </div>
</main>

<BottomBar page="history"/>