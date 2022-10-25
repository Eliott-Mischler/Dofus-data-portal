import { error } from "@sveltejs/kit";
import { prisma } from "$lib/db";

export async function load() {
    const names = await prisma.ItemName.findMany({
        select: {
            name : true
        },
        orderBy : [
            {
                name : 'asc'
            }
        ]
    })
    if (names) return { names };
    throw error(404, 'Database query failure')

}