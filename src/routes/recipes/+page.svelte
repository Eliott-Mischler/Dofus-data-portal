<script>
    export let data;
    export let form;
    $: i = 0;
    function handleClick() {
        i+=1;
    }
</script>

<div class="centered-top-div">
<form class="recipe-form">
    <label for="result-name">Nom de l'objet créé :</label>
    <input type="text" name="result-name" id="result-name">

    <label for="result-name">Ingrédient 1 :</label>
    <input type="text" name="ingredient-1" id="ingredient-1" list="item-names">

    <label for="result-name">Ingrédient 2 :</label>
    <input type="text" name="ingredient-2" id="ingredient-2" list="item-names">
    {#each Array(i) as _, i}
        <label for="result-name">Ingrédient {i+3} :</label>
        <input type="text" name={"ingredient" + (i+3)} id="{"ingredient" + (i+3)}" list="item-names">
    {/each}

    <button on:click|preventDefault={handleClick}>Ajouter un ingrédient</button>
    <button type="submit">Envoyer</button>
</form>

</div>

<datalist id="item-names">
	{#each data.names as item}
		<option value={item.name}>{item.name}</option>
	{/each}
</datalist>