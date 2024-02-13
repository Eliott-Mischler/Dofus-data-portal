import { prisma } from "$lib/db";
import { json } from "@sveltejs/kit";

export async function GET() {
    return json(await prisma.ItemName.findMany())

}
export async function POST({ request }) {
    const data = await request.json()
    console.log(data)
    return json(await prisma.ItemName.createMany({
        data,
        skipDuplicates: true
    }))

}


export async function DELETE() {
    return json(await prisma.ItemName.deleteMany())
}