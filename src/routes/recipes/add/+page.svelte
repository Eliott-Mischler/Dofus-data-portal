<script>
    export let data;
    export let form;
    $: i = 2;
    function handleAdd() {
        if(i<8) i+=1;
    }
    function handleRemove() {
        if(i>2) i-=1;
    }
</script>

<div class="centered-top-div">
<form class="recipe-form" method="POST">
    <label for="result-name">Nom de l'objet:</label>
    <input class="ing" type="text" name="result-name" id="result-name">
    <span class="qte">Qté :</span>

    {#each Array(i) as _, j}
        <label for="{"ingredient-" + (j+1)}">Ingrédient {j+1} :</label>
        <input class="ing" type="text" name={"ingredient-" + (j+1)} id={"ingredient-" + (j+1)} list="item-names" required autofocus={j+1==i}>
        <input class="qte" type="number" name={"ingredient-"+ (j+1) + "-amount"} id={"ingredient-"+ (i+1) + "-amount"} required>
    {/each}

    {#if form?.missing}<p class="error">Quantité manquante</p>{/if}

    
    <div class="ing add" style="display:flex;">
        <button on:click|preventDefault={handleAdd} style="border: 0; background: 0;">
            <img src="/plus-icon.svg" alt="add" style="height:20px" />
        </button>

        <button  on:click|preventDefault={handleRemove} style="border: 0; background: 0;">
            <img src="/dash-3.svg" alt="remove" style="height:20px" />
        </button>
    </div>
    <button class="ing send" type="submit">Envoyer</button>
</form>
{#if form?.recipe}
    <p class="success">Recette pour {form.itemName} créée avec succès !</p>
{/if}
{#if form?.error}
    <p class="error">Erreur !</p>
{/if}

</div>

<datalist id="item-names">
	{#each data.names as item}
		<option value={item.name}>{item.name}</option>
	{/each}
</datalist>