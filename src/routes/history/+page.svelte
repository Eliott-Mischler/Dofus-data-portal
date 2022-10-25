<script>
	export let data;
	import { browser } from '$app/environment';
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';
	import 'chartjs-adapter-luxon';
	import { DateTime } from 'luxon';
	Chart.register(...registerables);
	let lineChartElement;

	let myChart;
	onMount(() => {
		if (browser) {
			myChart = new Chart(lineChartElement, {
				type: 'line'
			});
		}
	});
	let chosenItem;
	let graphData = {
		labels: [],
		datasets: []
	};
	let allVals = [];
	let nb = 0;
	let rgbs = [
		{
			primary: 'rgb(35, 145, 235)',
			secondary: 'rgba(15, 70, 108, .3)'
		},
		{
			primary: 'rgb(152, 57, 230)',
			secondary: 'rgba(70, 25, 110, .3)'
		},
		{
			primary: 'rgb(61, 173, 42)',
			secondary: 'rgba(28, 85, 20, .3)'
		},
		{
			primary: 'rgb(179, 153, 27)',
			secondary: 'rgba(80, 75, 12, .3)'
		},
		{
			primary: 'rgb(224, 115, 13)',
			secondary: 'rgba(100, 58, 5, .3)'
		},
		{
			primary: 'rgb(217, 26, 55)',
			secondary: 'rgba(100, 13, 28, .3)'
		}
	];
	async function graph() {
		let labels = [];
		let values = [];
		let lvs = [];
		let response = await fetch('/api', {
			method: 'POST',
			body: JSON.stringify(chosenItem),
			headers: {
				'content-type': 'application/json'
			}
		}).then((resp) => resp.json());
		console.log(response);
		await response.forEach((log) => {
			lvs.push({x : DateTime.fromISO(log.snapshot.dateTime),
					  y : parseInt(log.price)})
		});

		lvs.sort((lv1, lv2) => lv1.x.toMillis() - lv2.x.toMillis())
		for(let lv of lvs){
			labels.push(lv.x)
			values.push(lv.y)
		}
		graphData.labels = Array.from(
			new Set(
				labels
					.concat(graphData.labels)
					.map((d) => DateTime.fromISO(d))
					.sort((date1, date2) => date1.toMillis() - date2.toMillis())
					.map((date) => date.toString())
			)
		);

		let primary = nb < 7 ? rgbs[nb].primary : 'rgb(255,255,255)';
		let secondary = nb < 7 ? rgbs[nb].secondary : 'rgba(150,150,150,0.3)';

		graphData.datasets.push({
			label: chosenItem,
			fill: true,
			lineTension: 0.3,
			backgroundColor: secondary,
			borderColor: primary,
			pointBorderColor: 'rgb(255, 255, 255)',
			pointBackgroundColor: primary,
			pointRadius: 12,
			pointBorderWidth: 0,
			pointHoverRadius: 9,
			pointHoverBackgroundColor: 'rgb(0, 0, 0)',
			pointHoverBorderColor: 'rgba(220, 220, 220,1)',
			pointHoverBorderWidth: 3,
			pointHitRadius: 12,
			data: lvs
		});
		nb++;

		allVals = allVals.concat(values);
		let min = Math.floor(
			Math.max(0, Math.min(Math.min(...allVals) - (Math.max(...allVals) - Math.min(...allVals)) * 3, Math.min(...allVals) * 0.6))
		);
		let max = Math.floor(
			Math.max(...allVals) + Math.max(Math.min(...allVals) - min, Math.max(...allVals) * 0.5)
		);
		let log = Math.max(...allVals) / Math.min(...allVals) > 10 ? true : false;
		myChart.destroy();
		myChart = new Chart(lineChartElement, {
			type: 'line',
			data: graphData,
			options: {
				responsive: true,
				plugins: {
					legend: {
						labels: {
							color: 'rgb(190, 201, 209)',
							font: {
								size: 18
							}
						}
					}
				},
				scales: {
					x: {
						type: 'time',
						time: {
							unit: 'day'
						},

						ticks: {
							color: 'rgb(190, 201, 209)'
						},
						title: {
							display: true,
							text: 'Date',
							color: 'rgb(190, 201, 209)',
							font : {
								size: 28,
								weight: 'bold'
							},
						},
						grid: {
							color: 'rgba(190, 201, 209, 0.1)'
						}
					},
					y: {
						title: {
							display: true,
							text: log ? 'Price (log)' : 'Price',
							color: log ? 'rgb(207, 176, 52)' : 'rgb(190, 201, 209)',
							font : {
								size: 28,
								weight: 'bold'
							}
						},
						type: Math.max(...allVals) / Math.min(...allVals) > 10 ? 'logarithmic' : 'linear',
						ticks: {
							color: 'rgb(190, 201, 209)'
						},
						grid: {
							color: 'rgba(190, 201, 209, 0.1)'
						},
						min,
						max
					}
				}
			}
		});
	}

	function reset() {
		myChart.destroy();
		nb = 0;
		allVals = [];
		graphData = {
			labels: [],
			datasets: []
		};
	}
</script>

<div class="centered-top-div">
	<input type="text" id="item-name" list="item-names" bind:value={chosenItem} />
	<button on:click={graph} style="border: 0; background: 0;">
		<img src="/plus-icon.svg" alt="reset" style="height:20px" />
	</button>
	<button on:click={reset} style="border: 0; background: 0;">
		<img src="/reset-8.svg" alt="reset" style="height:20px" />
	</button>
</div>

<datalist id="item-names">
	{#each data.names as item}
		<option value={item.name}>{item.name}</option>
	{/each}
</datalist>
<canvas bind:this={lineChartElement} style="width:16;height:9;max-height: 80%;" />

<style>
	button:hover {
		cursor: pointer;
	}
</style>
