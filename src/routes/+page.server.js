import { error } from "@sveltejs/kit";
import { prisma } from "$lib/db";

export async function load() {
    const names = await prisma.ItemPrice.findMany({
        distinct: ['name'],
        select: {
            name : true
        }
    })
    if (names) return {names : names};
    throw error(404, 'Database query failure')

}