import { prisma } from '$lib/db';

export async function load() {
    const recipes = await prisma.Recipe.findMany();
    const itemNames = await prisma.ItemName.findMany({
        where: {
            id: {
                in: Array.from(new Set(recipes
                    .map(e => {
                        let items = [];
                        items.push(e.resultId)
                        if (e.ingredient_1) items.push(e.ingredient_1);
                        if (e.ingredient_2) items.push(e.ingredient_2);
                        if (e.ingredient_3) items.push(e.ingredient_3);
                        if (e.ingredient_4) items.push(e.ingredient_4);
                        if (e.ingredient_5) items.push(e.ingredient_5);
                        if (e.ingredient_6) items.push(e.ingredient_6);
                        if (e.ingredient_7) items.push(e.ingredient_7);
                        if (e.ingredient_8) items.push(e.ingredient_8);
                        return items;
                    })
                    .reduce((p, c) => p.concat(c))
                ))
            }
        }
    });

    const lastSnapshot = await prisma.Snapshot.findMany({
        where: {
            type: 'resource'
        },
        orderBy: [{
            id: 'desc'
        }],
        take: 1
    })

    let idNameMap = new Map();
    itemNames.map(e => idNameMap.set(e.id, e.name));

    const craftingCosts = await prisma.CraftingCost.findMany();

    if (craftingCosts.length === 0 || craftingCosts[0].dateTimeId != lastSnapshot[0].id || recipes.length > craftingCosts.length) {
        const ingredients = Array.from(new Set(recipes
            .map(e => {
                let ingredients = [];
                if (e.ingredient_1) ingredients.push(e.ingredient_1);
                if (e.ingredient_2) ingredients.push(e.ingredient_2);
                if (e.ingredient_3) ingredients.push(e.ingredient_3);
                if (e.ingredient_4) ingredients.push(e.ingredient_4);
                if (e.ingredient_5) ingredients.push(e.ingredient_5);
                if (e.ingredient_6) ingredients.push(e.ingredient_6);
                if (e.ingredient_7) ingredients.push(e.ingredient_7);
                if (e.ingredient_8) ingredients.push(e.ingredient_8);
                return ingredients;
            })
            .reduce((p, c) => p.concat(c))
        ));

        const ingredientPrices = await prisma.ItemPrice.findMany({
            distinct: ['itemNameId'],
            where: {
                itemNameId: {
                    in: ingredients
                }
            },
            orderBy: [
                {
                    snapshotId: 'desc'
                }
            ]
        });


        // Return format : 
        // [
        //     { id: 51616, price: 1494, snapshotId: 31, itemNameId: 2604 },
        //     { id: 51194, price: 1296, snapshotId: 31, itemNameId: 2182 },
        //     { id: 50197, price: 478, snapshotId: 31, itemNameId: 1185 }
        //  ]
        let idPriceMap = new Map();
        ingredientPrices.map(e => idPriceMap.set(e.itemNameId, e.price))

        const costs = recipes.map(e => {
            let cost = 0;
            if (e.ingredient_1) cost += (e.ingredient_1_amount * idPriceMap.get(e.ingredient_1));
            if (e.ingredient_2) cost += (e.ingredient_2_amount * idPriceMap.get(e.ingredient_2));
            if (e.ingredient_3) cost += (e.ingredient_3_amount * idPriceMap.get(e.ingredient_3));
            if (e.ingredient_4) cost += (e.ingredient_4_amount * idPriceMap.get(e.ingredient_4));
            if (e.ingredient_5) cost += (e.ingredient_5_amount * idPriceMap.get(e.ingredient_5));
            if (e.ingredient_6) cost += (e.ingredient_6_amount * idPriceMap.get(e.ingredient_6));
            if (e.ingredient_7) cost += (e.ingredient_7_amount * idPriceMap.get(e.ingredient_7));
            if (e.ingredient_8) cost += (e.ingredient_8_amount * idPriceMap.get(e.ingredient_8));
            return { recipeId: e.resultId, cost }
        })

        let recipeIdPriceMap = new Map();
        costs.map(e => recipeIdPriceMap.set(e.recipeId, e.cost));


        let payload = recipes.map(recipe => {
            let ingredients = []
            if (recipe.ingredient_1) ingredients.push(idNameMap.get(recipe.ingredient_1));
            if (recipe.ingredient_2) ingredients.push(idNameMap.get(recipe.ingredient_2));
            if (recipe.ingredient_3) ingredients.push(idNameMap.get(recipe.ingredient_3));
            if (recipe.ingredient_4) ingredients.push(idNameMap.get(recipe.ingredient_4));
            if (recipe.ingredient_5) ingredients.push(idNameMap.get(recipe.ingredient_5));
            if (recipe.ingredient_6) ingredients.push(idNameMap.get(recipe.ingredient_6));
            if (recipe.ingredient_7) ingredients.push(idNameMap.get(recipe.ingredient_7));
            if (recipe.ingredient_8) ingredients.push(idNameMap.get(recipe.ingredient_8));
            let amounts = [recipe.ingredient_1_amount,
            recipe.ingredient_2_amount,
            recipe.ingredient_3_amount,
            recipe.ingredient_4_amount,
            recipe.ingredient_5_amount,
            recipe.ingredient_6_amount,
            recipe.ingredient_7_amount,
            recipe.ingredient_8_amount]
            return {
                resultId: recipe.resultId,
                result: idNameMap.get(recipe.resultId),
                ingredients,
                amounts,
                price: recipeIdPriceMap.get(recipe.resultId),
            }
        })

        await prisma.$transaction(
            payload.map(r => ({
                resultId: r.resultId,
                price: r.price,
                dateTimeId: lastSnapshot[0].id
            }))
                .map(p => prisma.CraftingCost.upsert({
                    where: { resultId: p.resultId },
                    update: {
                        dateTimeId: p.dateTimeId,
                        price: p.price
                    },
                    create: {
                        dateTimeId: p.dateTimeId,
                        price: p.price,
                        resultId: p.resultId
                    }
                }))

        )


        if (payload) return { payload }
    }



    let craftingCostMap = new Map();
    craftingCosts.map(e => craftingCostMap.set(e.resultId, e.price))
    let payload = recipes.map(recipe => {
        let ingredients = []
        if (recipe.ingredient_1) ingredients.push(idNameMap.get(recipe.ingredient_1));
        if (recipe.ingredient_2) ingredients.push(idNameMap.get(recipe.ingredient_2));
        if (recipe.ingredient_3) ingredients.push(idNameMap.get(recipe.ingredient_3));
        if (recipe.ingredient_4) ingredients.push(idNameMap.get(recipe.ingredient_4));
        if (recipe.ingredient_5) ingredients.push(idNameMap.get(recipe.ingredient_5));
        if (recipe.ingredient_6) ingredients.push(idNameMap.get(recipe.ingredient_6));
        if (recipe.ingredient_7) ingredients.push(idNameMap.get(recipe.ingredient_7));
        if (recipe.ingredient_8) ingredients.push(idNameMap.get(recipe.ingredient_8));
        let amounts = [recipe.ingredient_1_amount,
        recipe.ingredient_2_amount,
        recipe.ingredient_3_amount,
        recipe.ingredient_4_amount,
        recipe.ingredient_5_amount,
        recipe.ingredient_6_amount,
        recipe.ingredient_7_amount,
        recipe.ingredient_8_amount]
        amounts = amounts.filter(a => { return !!a })
        return {
            resultId: recipe.resultId,
            result: idNameMap.get(recipe.resultId),
            ingredients,
            amounts,
            price: craftingCostMap.get(recipe.resultId),
        }
    })
    return {payload}

}