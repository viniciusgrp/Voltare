<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fetchAge } from '$lib';

	export let data;

	let inputValue = $page.url.searchParams.get('name') || '';
	let timeout;
	let progress = 0;
	let progressInterval;

	const DEBOUNCE_MS = 700;
	const PROGRESS_INTERVAL_MS = 10;

	$page.subscribe(($page) => {
		const q = $page.url.searchParams.get('name') || '';
		if (q !== inputValue) inputValue = q;
	});

	function onInput(e) {
		clearTimeout(timeout);
		clearInterval(progressInterval);
		inputValue = e.target.value;
		progress = 0;

		const start = Date.now();
		progressInterval = setInterval(() => {
			const elapsed = Date.now() - start;
			progress = Math.min(100, (elapsed / DEBOUNCE_MS) * 100);
			if (progress >= 100) {
				clearInterval(progressInterval);
			}
		}, PROGRESS_INTERVAL_MS);

		timeout = setTimeout(() => {
			clearInterval(progressInterval);
			progress = 100;
			goto(`/?name=${encodeURIComponent(inputValue)}`, { replaceState: true, invalidateAll: true });
		}, DEBOUNCE_MS);
	}
</script>

<script context="module">
export async function load({ url }) {
	const name = url.searchParams.get('name');
	if (!name) return { data: null };
	const data = await fetchAge(name);
	return { data };
}
</script>

<div class="container">
	<h1>Agify.io Estimador de Idade</h1>
	<input
		type="text"
		placeholder="Digite um nome..."
		bind:value={inputValue}
		on:input={onInput}
		autocomplete="off"
		spellcheck="false"
	/>

	<div class="progress-bar-wrapper" aria-hidden={!inputValue}>
		<div class="progress-bar {progress === 100 ? 'complete' : ''}" style="width: {progress}%;"></div>
	</div>

	{#if inputValue}
		{#if $page.url.searchParams.get('name') && !data}
			<p class="result">Consultando...</p>
		{:else if data && data.age}
			<p class="result">Idade estimada para <b>{data.name}</b>: <b>{data.age}</b> anos.</p>
		{:else if data && data.name}
			<p class="result">Não foi possível estimar a idade para <b>{data.name}</b>.</p>
		{/if}
	{/if}
</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.container {
	max-width: 400px;
	margin: 60px auto;
	padding: 2rem 2.5rem 2.5rem 2.5rem;
	background: #f7f7fa;
	border-radius: 1.5rem;
	box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
	text-align: center;
	font-family: 'Inter', Arial, sans-serif;
}
h1 {
	font-size: 1.5rem;
	margin-bottom: 1.5rem;
	font-family: 'Inter', Arial, sans-serif;
	color: #2d2d3a;
}
input[type="text"] {
	width: 100%;
	padding: 0.75rem 1rem;
	font-size: 1.1rem;
	border: 2px solid #d1d1e0;
	border-radius: 0.75rem;
	outline: none;
	transition: border 0.2s;
	margin-bottom: 1.5rem;
	background: #fff;
	color: #2d2d3a;
	box-sizing: border-box;
	font-family: 'Inter', Arial, sans-serif;
}
input[type="text"]:focus {
	border-color: #6c63ff;
}
.progress-bar-wrapper {
	width: 100%;
	height: 6px;
	background: #e0e0ef;
	border-radius: 3px;
	margin-bottom: 1.2rem;
	overflow: hidden;
	position: relative;
	transition: opacity 0.2s;
	opacity: 1;
}
.progress-bar {
	height: 100%;
	background: linear-gradient(90deg, #6c63ff 0%, #4e54c8 100%);
	transition: width 0.1s linear, background 0.2s;
}
.progress-bar.complete {
	background: linear-gradient(90deg, #4caf50 0%, #43e97b 100%);
}
[aria-hidden="true"] {
	opacity: 0;
	pointer-events: none;
}
.result {
	font-size: 1.1rem;
	margin-top: 0.5rem;
	color: #444;
	font-family: 'Inter', Arial, sans-serif;
}
</style>
