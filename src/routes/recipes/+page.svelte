<script>
    export let data;
</script>

<div class="heading-title">
    <h1>Mes recettes</h1>
    <a href="/recipes/add">
        <img src="/plus-icon.svg" alt="add" style="height:20px" />
    </a>
</div>


<div class="recipes">
    {#each data.payload as recipe}
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