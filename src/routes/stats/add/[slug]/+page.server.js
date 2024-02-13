import {prisma}from '$lib/db'
import {error, invalid} from '@sveltejs/kit'

let reference = new Map();

export async function load({params}) {


    const names = await prisma.StatName.findMany({
        select: {
            name : true,
            runeId : true
        },
        orderBy : [
            {
                name : 'asc'
            }
        ]
    })
    if (names) names.forEach(obj => reference.set(obj.name, obj.runeId));

    const target = await prisma.ItemName.findUnique({
        where : {
            id: parseInt(params.slug)
        }
    });

    if (names) return { names, target };
    throw error(404, 'Database query failure')

}


export const actions = {
    default: async({request, params}) => {
        console.log(params.slug);
        const data = await request.formData();
        console.log(reference);
        let obj = {}
        let m = new Map();
        let i = 1
        while(data.get("stat-" + i)) {
            if(data.get("stat-" + i) && data.get("stat-" + i + "-min") && data.get("stat-" + i + "-max")) {
                m.set("stat_" + i, parseInt(reference.get(data.get("stat-" + i))))
                m.set("min_" + i, parseInt(data.get("stat-" + i + "-min")))
                m.set("max_" + i, parseInt(data.get("stat-" + i + "-max")))
            }
            i++;
        }
        obj = Object.fromEntries(m)
        obj.level = parseInt(data.get("level"));
        obj.itemId = parseInt(params.slug);
        const result = await prisma.ItemStats.create({
            data : obj
        })

        if(result) return {success : true}
    }
}