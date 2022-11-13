<script>
    export let data;
    let inputValue = '';
    let searchResults;
    function doSearch(pattern) {
        searchResults = data.payload.filter(
            p => {
               return p.result.toLowerCase().includes(pattern.toLowerCase()) ||
                      p.runes.filter(rune => rune.toLowerCase().inclues(pattern.toLowerCase()));
            }
        )
    }
</script>

<div class="heading-title">
    <h1>Historique de brisage</h1>
    <input type="text" name="search" id="search" bind:value={inputValue} on:input={doSearch(inputValue)}>
    <a href="/recipes/add">
        <img src="/plus-icon.svg" alt="add" style="height:20px" />
    </a>
</div>