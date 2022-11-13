<script>
    export let data;
    let inputValue = '';
    let searchResults = [];
    function doSearch(pattern) {
        searchResults = data.payload.filter(
            p => {
               return p.result.toLowerCase().includes(pattern.toLowerCase());
            }
        )
    }
</script>

<div class="heading-title">
    <h1>Statistiques</h1>
    <input type="text" name="search" id="search" bind:value={inputValue} on:input={doSearch(inputValue)}>
    <a href="/stats/add">
        Renseigner
    </a>
</div>


<div class="recipes">
    {#each (searchResults || data.payload) as recipe}
        <div class="recipe-card">
            <h2 class="result">{recipe.result}</h2>
            <div class="ingredients">
            {#each recipe.ingredients as ingredient, i}
            <p class="ingredient">{recipe.amounts[i]} x {ingredient}</p>
            {/each}
            </div>
            <p class="cost">Coût : {recipe.price}</p>
        </div>
    {/each}
</div>