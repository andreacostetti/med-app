<script>
    import { goto } from "$app/navigation";
    import BottomBar from "$lib/bottom-bar.svelte";
    import Navbar from "$lib/navbar.svelte";
    import Testcard from "$lib/test-card.svelte";
</script>

<Navbar/>

<main class="p-6 mb-20">
    <h1 class="text-4xl font-bold font-epilogue mt-4">Il tuo account</h1>
    <p class="text-gray-500">Verifica lo stato del tuo piano e modifica le tue informazioni personali.</p>


    <button class="rounded-xl px-4 py-2 bg-indigo-600 text-white font-semibold cursor-pointer mt-10" onclick={() => {goto("/login")}}>Vai al login</button>
    
</main>

<BottomBar page='profile'/>