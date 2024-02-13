import { prisma } from "$lib/db";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    let data = await request.json()
    const dateTime = await prisma.Snapshot.create({
        data : {
            type : 'RESOURCE'
        }
    })


    data = data.map(line => {
        line.snapshotId = dateTime.id
        line.itemNameId = parseInt(line.itemNameId)
        return line
    })
    return json(await prisma.ItemPrice.createMany({
        data,
        skipDuplicates: true
    }))

}


export async function GET() {
    return json(await prisma.ItemPrice.findMany())
}


export async function DELETE() {
    return json(await prisma.ItemPrice.deleteMany())
}