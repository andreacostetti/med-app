<script>
    import { goto } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
    import { user } from '$lib/user';
    import { onMount } from 'svelte';
	
	let { children } = $props();

    onMount(() => {
        if(!user.isLoggedIn) {
            goto('/login');
        }
    })
	
	
</script>

{@render children()}
