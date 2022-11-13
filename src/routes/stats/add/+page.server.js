import {prisma} from '$lib/db';

export async function load() {
    const itemStats = await prisma.ItemStats.findMany();
    const unstattedItemIds = await prisma.Recipe.findMany({
        where: {
            NOT : {
                id : {
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
    console.log(unstattedItemNames);
    if(unstattedItemNames) return {payload : unstattedItemNames}
}