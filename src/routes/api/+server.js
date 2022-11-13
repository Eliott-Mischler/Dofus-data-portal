import { prisma } from "$lib/db";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    const name = await request.json()
    let itemNameId = await prisma.ItemName.findMany({
        where: {
            name
        },
        take: 1
    })
    itemNameId = itemNameId[0].id;
    return json(await prisma.ItemPrice.findMany({
        select: {
            price: true,
            snapshot: {
                select: {
                    dateTime: true
                }
            }
        },
        where: {
            itemNameId
        }
    }))
}