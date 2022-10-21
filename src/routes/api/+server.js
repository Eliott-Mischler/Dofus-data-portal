import { prisma } from "$lib/db";
import { json } from "@sveltejs/kit";

export async function POST({request}) {
    const name = await request.json()
    return json(await prisma.ItemPrice.findMany({
            select : {
                price: true,
                snapshot : {
                    select : {
                        dateTime : true
                    }
                }
            },
            where : {
                name: name
            }
        }))
}