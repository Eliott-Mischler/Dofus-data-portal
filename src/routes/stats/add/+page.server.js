import {prisma} from '$lib/db';

export async function load() {
    const itemStats = await prisma.ItemStats.findMany();
    console.log(itemStats.map(e => e.itemId))
    const unstattedItemIds = await prisma.Recipe.findMany({
        where: {
            NOT : {
                resultId : {
                    in : itemStats.map(e => e.itemId)
                }
            }
        }
    });

    const unstattedItemNames = await prisma.ItemName.findMany({
        where : {
            id: {
                in : unstattedItemIds.map(e => e.resultId)
            }
        }
    })
    if(unstattedItemNames) return {payload : unstattedItemNames}
}