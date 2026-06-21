<script>
    import { goto } from '$app/navigation';
    import { 
        subscriptionState, 
        presentPaywall, 
        openCustomerCenter 
    } from '$lib/revenuecat.svelte.js';

    let isLoading = $state(false);

    async function handleUpgrade() {
        isLoading = true;
        await presentPaywall();
        isLoading = false;
    }
</script>

<button onclick={() => {goto('/home')}}>back</button>
<div class="p-6 max-w-md mx-auto mt-10 border rounded-2xl bg-white shadow-sm">
    {#if !subscriptionState.isInitialized}
        <p class="text-gray-500">Loading subscription status...</p>
    {:else}
        {#if subscriptionState.hasActiveSubscription}
            <div class="bg-green-100 text-green-800 p-4 rounded-xl mb-4">
                <h2 class="font-bold">Unitest Pro Active</h2>
                <p class="text-sm">Thank you for your support!</p>
            </div>
            
            <button 
                class="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-colors"
                onclick={openCustomerCenter}
            >
                Manage Subscription
            </button>
        {:else}
            <div class="bg-indigo-50 text-indigo-900 p-4 rounded-xl mb-4">
                <h2 class="font-bold">Unlock Unitest Pro</h2>
                <p class="text-sm">Get access to all advanced test features.</p>
            </div>
            
            <button 
                class="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                onclick={handleUpgrade}
                disabled={isLoading}
                style="color: "
            >
                {isLoading ? 'Loading...' : 'View Plans'}
            </button>
        {/if}
    {/if}
</div>

{#if subscriptionState?.customerInfo}
    <p>Customer RevenueCat ID: {subscriptionState.customerInfo.originalAppUserId}</p>

    <div class="mt-8 p-4 bg-gray-900 text-green-400 text-xs font-mono rounded-lg overflow-auto max-h-64">
        <p class="font-bold text-white mb-2">DEBUG REVENUECAT:</p>
        <p>Entitlement cercato nel codice: 'Pro'</p>
        <p>Entitlements attivi trovati:</p>
        <pre>{JSON.stringify(subscriptionState.customerInfo?.entitlements?.active, null, 2)}</pre>
        
        <p class="mt-4 font-bold text-white">Tutti gli entitlements (anche scaduti/fittizi):</p>
        <pre>{JSON.stringify(subscriptionState.customerInfo?.entitlements?.all, null, 2)}</pre>
    </div>
    <br>
    <div class="mt-8 p-4 bg-gray-900 text-green-400 text-xs font-mono rounded-lg overflow-auto max-h-64">
        
        <pre>{JSON.stringify(subscriptionState, null, 2)}</pre>
    </div>

    
{/if}