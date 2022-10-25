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

export const actions = {
    addRecipe: async({request}) => {
        const data = await request.formData();
        const resultName = data.get('result-name');
        let i = 1;
        let ingredients = [];
        while(data.get(`ingredient-${i}`)) {
            ingredients.push(data.get(`ingredient-${i}}`);
            i++;
        }

        

    }
}