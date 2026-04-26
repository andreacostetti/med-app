<script>
    import { goto } from "$app/navigation";

    let {page} = $props();
</script>

<div class="flex justify-evenly items-center px-8 py-6 bg-white fixed bottom-0 w-screen left-0 select-none">
    <div class="text-center cursor-pointer" onclick={() => {goto('/home');}}>
        <span class="material-symbols-rounded" style={page == 'home' ? "font-variation-settings: 'FILL' 1" : ""}>home</span>
    </div>
    <div class="text-center cursor-pointer" onclick={() => {goto('/history');}}>
        <span class="material-symbols-rounded" style={page == 'history' ? "font-variation-settings: 'FILL' 1" : ""}>history</span>
    </div>
    <div class="text-center cursor-pointer" onclick={() => {goto('/premium');}}>
        <span class="material-symbols-rounded" style={page == 'premium' ? "font-variation-settings: 'FILL' 1" : ""}>crown</span>
    </div>
    <div class="text-center cursor-pointer" onclick={() => {goto('/profile');}}>
        <span class="material-symbols-rounded" style={page == 'profile' ? "font-variation-settings: 'FILL' 1" : ""}>person</span>
    </div>
</div>