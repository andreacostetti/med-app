<script>
	import ChartComponent from './chart.svelte';

	// Definisci i dati utilizzando $state se prevedi di modificarli in tempo reale
	let matchData = $state.raw({
		labels: ['Q1', 'Q2', 'Q3', 'Q4'],
		datasets: [
			{
				label: 'Punti a referto',
				data: [18, 22, 15, 25],
				backgroundColor: 'rgba(249, 115, 22, 0.2)',
				borderColor: 'rgba(249, 115, 22, 1)',
				borderWidth: 2
			}
		]
	});
	
	let chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
                display: false
            }
		}
	};
</script>

<main class="p-8">
	<h1 class="text-2xl font-bold mb-6">Statistiche Partita</h1>
	
	<div class="relative h-[400px] w-full max-w-3xl rounded-xl bg-white shadow-md p-4">
		<ChartComponent type="line" data={matchData} options={chartOptions} />
	</div>
</main>