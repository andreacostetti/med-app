<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Capacitor } from '@capacitor/core';
    import { StatusBar, Style } from '@capacitor/status-bar';
    import { onMount } from 'svelte';
	import { initRevenueCat } from '$lib/revenuecat.svelte';
	
	let { children } = $props();

	if (Capacitor.isNativePlatform()) {
		StatusBar.show();
		StatusBar.setOverlaysWebView({ overlay: false });
	}

	let isDarkMode = $state(false);

	onMount(() => {
		initRevenueCat();
		
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		isDarkMode = mediaQuery.matches;

		const handleChange = (e) => {
			isDarkMode = e.matches;
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	});

	$effect(() => {
		if (Capacitor.isNativePlatform()) {
			updateNativeStatusBar(isDarkMode);
		}
	});

	async function updateNativeStatusBar(dark) {
		try {
			if (dark) {
				await StatusBar.setStyle({ style: Style.Dark });
				await StatusBar.setBackgroundColor({ color: '#16161d' }); // e.g., Zinc 900
			} else {
				await StatusBar.setStyle({ style: Style.Light });
				await StatusBar.setBackgroundColor({ color: '#ffffff' }); // White
			}
		} catch (error) {
			console.error('Failed to update status bar:', error);
		}
	}
	
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
