<script>
	import { Chart, registerables } from 'chart.js';
	Chart.register(...registerables);

	let { type = 'line', data, options = {} } = $props();

	let canvasElement = $state();
	let chartInstance = $state();

	$effect(() => {
		if (canvasElement) {
			chartInstance = new Chart(canvasElement, {
				type,
				// Usiamo snapshot per rimuovere i Proxy prima dell'inizializzazione
				data: $state.snapshot(data), 
				options
			});
		}

		return () => {
			if (chartInstance) {
				chartInstance.destroy();
			}
		};
	});

	$effect(() => {
		if (chartInstance && data) {
			// Usiamo snapshot anche qui per gli aggiornamenti
			chartInstance.data = $state.snapshot(data);
			chartInstance.update();
		}
	});
</script>

<canvas bind:this={canvasElement}></canvas>