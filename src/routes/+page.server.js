import { error } from "@sveltejs/kit";
import { prisma } from "$lib/db";

export async function load() {
    const names = await prisma.ItemPrice.findMany({
        distinct: ['itemNameId'],
        select: {
            itemName: {
                select: {
                    name: true
                }
            }
        }
    })
    if (names) return { names };
    throw error(404, 'Database query failure')

}