<script>
    import { goto } from "$app/navigation";
    import { 
        subscriptionState, 
        presentPaywall, 
        openCustomerCenter 
    } from '$lib/revenuecat.svelte.js';

    let {page} = $props();
</script>

<div class="flex justify-around items-center px-8 py-6 pb-[calc(env(safe-area-inset-bottom)+24px)] bg-white dark:bg-[#16161d] border-t-gray-100 dark:border-t-[#1d1d26] border-t fixed bottom-0 w-screen left-0 select-none">
    <div class="text-center cursor-pointer" onclick={() => {goto('/home');}}>
        <span class="material-symbols-rounded" style={`font-size: 30px; ${page == 'home' ? "font-variation-settings: 'FILL' 1;" : ""}`}>home</span>
    </div>
    <div class="text-center cursor-pointer" onclick={() => {goto('/history');}}>
        <span class="material-symbols-rounded" style={`font-size: 30px; ${page == 'history' ? "font-variation-settings: 'FILL' 1;" : ""}`}>history</span>
    </div>
    {#if subscriptionState.isInitialized}
        {#if !subscriptionState.hasActiveSubscription}
            <div class="text-center cursor-pointer" onclick={async () => {await presentPaywall()}}>
                <span class="material-symbols-rounded" style={`font-size: 30px; ${page == 'premium' ? "font-variation-settings: 'FILL' 1;" : ""}`}>crown</span>
            </div>
        {/if}
    {/if}
    
    <div class="text-center cursor-pointer" onclick={() => {goto('/profile');}}>
        <span class="material-symbols-rounded" style={`font-size: 30px; ${page == 'profile' ? "font-variation-settings: 'FILL' 1;" : ""}`}>person</span>
    </div>
</div>