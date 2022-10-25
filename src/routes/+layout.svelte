<script>
    import Navbar from "$lib/components/Navbar.svelte";
</script>
<svelte:head>
    <link rel="stylesheet" href="/app.css">
</svelte:head>
<nav>
    <Navbar />
</nav>

<main style="height:80vh">
	<slot />
</main>

<style>
</style>
