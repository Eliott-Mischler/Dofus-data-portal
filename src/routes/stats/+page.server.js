import { prisma } from '$lib/db';

export async function load() {
    const itemStats = await prisma.ItemStats.findMany();
    const stattedItemIds = itemStats.map(e => e.itemId);

    const itemNames = await prisma.ItemName.findMany({
        where: {
            id: {
                in: stattedItemIds
            }
        }
    });

    let idNameMap = new Map();
    itemNames.map(e => idNameMap.set(e.id, e.name));




    const payload = itemStats.map(
        itemStat => ({
            id: itemStat.id,
            name: idNameMap.get(itemStat.id),
        })
    )

    if(payload) return {payload}
}