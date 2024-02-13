<script>
    export let data;
    export let form;
    $: i = 2;
    function handleAdd() {
        if(i<20) i+=1;
    }
    function handleRemove() {
        if(i>1) i-=1;
    }
</script>
<p class="error" style="text-align: center">/!\ Ne pas renseigner les stats négatives! </p>
<h1 style="text-align: center">Statistiques de {data.target.name}</h1>
<div class="centered-top-div">
<form class="stat-form" method="POST">
    <label for="level">Niveau de l'objet :</label>
    <input class="level" type="text" name="level" id="level" required>
    <span class="min">min :</span>
    <span class="max">max :</span>

    {#each Array(i) as _, j}
        <label for="{"stat-" + (j+1)}">Statistique {j+1} :</label>
        <input class="stat" type="text" name={"stat-" + (j+1)} id={"stat-" + (j+1)} list="item-stats" required autofocus={j+1==i}>
        <input class="min" type="number" name={"stat-"+ (j+1) + "-min"} id={"ingredient-"+ (i+1) + "-min"} required>
        <input class="max" type="number" name={"stat-"+ (j+1) + "-max"} id={"stat-"+ (i+1) + "-max"} required>
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
{#if form?.success}
    <p class="success">Statistiques ajoutées avec succès !</p>
{/if}
{#if form?.error}
    <p class="error">Erreur !</p>
{/if}

</div>

<datalist id="item-stats">
	{#each data.names as stat}
		<option value={stat.name}>{stat.name}</option>
	{/each}
</datalist>