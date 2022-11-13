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
    if (names) names.forEach(obj => reference.set(obj.name, obj.id));

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
        
        let obj = {}
        let m = new Map();
        let i = 1
        while(data.get("stat-" + i)) {
            if(data.get("stat-" + i) && data.get("stat-" + i + "-min") && data.get("stat-" + i + "-max")) {
                m.set("stat-" + i + '-max', data.get("stat-" + i))
                m.set("stat-" + i + "-min", data.get("stat-" + i + "-min"))
                m.set("stat-" + i + "-max", data.get("stat-" + i + "-max"))
            }
            i++;
        }
        obj = Object.fromEntries(m)

    }
}