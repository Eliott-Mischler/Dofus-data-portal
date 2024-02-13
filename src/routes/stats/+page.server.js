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
    console.log(idNameMap)

    const statNames = await prisma.StatName.findMany();
    const statIdNameMap = new Map()
    statNames.map(e => statIdNameMap.set(e.runeId, e.name))


    for(let iStat of itemStats) {
        console.log(iStat)
        const statsMap = new Map(Object.entries(itemStats[0]))
  
        let stats = []
        for(let i = 1; i < 20; i++) {
            stats.push({
                id : statsMap.get('stat_' + i),
                min : statsMap.get('min_' + i),
                max : statsMap.get('max_' + i)
            })
        }

        stats = stats.filter(e => e.id != null)

        stats = stats.map(e =>({
            name : statIdNameMap.get(e.id),
            min : e.min,
            max : e.max
            }))
        iStat.stats = stats

    }
    

    const payload = itemStats.map(
        itemStat => ({
            id: itemStat.itemId,
            name: idNameMap.get(itemStat.itemId),
            stats : itemStat.stats
        })
    )
    console.log(payload)
    

    if(payload) return {payload}
}