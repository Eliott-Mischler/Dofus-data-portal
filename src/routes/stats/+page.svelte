<script>
    export let data;
    let inputValue = '';
    let searchResults;
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
    {#each (searchResults || data.payload) as item}
        <div class="recipe-card">
            <h2 class="result">{item.name}</h2>
            <div class="ingredients">
            {#each item.stats as stat}
            <p class="ingredient">{stat.min} à {stat.max} {stat.name}</p>
            {/each}
            <a href="/stats/add/{item.id}" style="position: absolute; bottom: 15px; right: 25px;"><img src="/edit-246.svg" alt="renseigner" style="height:25px"> </a>
            </div>
        </div>
    {/each}
</div>