<script>
    export let data;
    let inputValue = '';
    let searchResults;
    function doSearch(pattern) {
        searchResults = data.payload.filter(
            p => {
               return p.name.toLowerCase().includes(pattern.toLowerCase());
            }
        )
    }
</script>

<div class="heading-title">
    <h1>Renseigner des statistiques</h1>
    <input type="text" name="search" id="search" bind:value={inputValue} on:input={doSearch(inputValue)}>
</div>


<div class="recipe" style="text-align: center">
    {#each (searchResults || data.payload) as recipe}
    <div style="display:flex; justify-content: center; align-items: center; gap:10px;">
            <h2 class="result"><a href="/stats/add/{recipe.id}">{recipe.name} </a></h2>
    </div>
    {/each}
</div>