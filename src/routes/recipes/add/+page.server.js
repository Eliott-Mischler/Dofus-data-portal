import { error, invalid } from "@sveltejs/kit";
import { prisma } from "$lib/db";
var reference = new Map();

export async function load() {
    const names = await prisma.ItemName.findMany({
        select: {
            name : true,
            id : true
        },
        orderBy : [
            {
                name : 'asc'
            }
        ]
    })
    if (names) names.forEach(obj => reference.set(obj.name, obj.id));

    if (names) return { names };
    throw error(404, 'Database query failure')

}

export const actions = {
    default: async({request}) => {

        const data = await request.formData();
        const resultName = data.get('result-name');
        var resultId = reference.get(resultName);
        if(!resultId) {
            const result = await prisma.ItemName.create({
                data : {
                    name:  resultName
                }
            });
            resultId = result.id; 
        }
        let i = 1;
        let ing = [];
        let amt = [];
        while(data.get(`ingredient-${i}`)) {
            ing.push(reference.get(data.get(`ingredient-${i}`)));
            amt.push(parseInt(data.get(`ingredient-${i}-amount`)));
            i++;
        }
        ing.forEach((v, i) => {
            if(v && !amt[i]) return invalid(400, {i, missing : true})
        })

        ing = ing.map(e => e ? e : null);
        amt = amt.map(e => e ? e : null);
        
        const recipe = await prisma.Recipe.create({
            data : {
                resultId,
                ingredient_1 : ing[0],
                ingredient_2 : ing[1],
                ingredient_3 : ing[2],
                ingredient_4 : ing[3],
                ingredient_5 : ing[4],
                ingredient_6 : ing[5],
                ingredient_7 : ing[6],
                ingredient_8 : ing[7],
                ingredient_1_amount : amt[0],
                ingredient_2_amount : amt[1],
                ingredient_3_amount : amt[2],
                ingredient_4_amount : amt[3],
                ingredient_5_amount : amt[4],
                ingredient_6_amount : amt[5],
                ingredient_7_amount : amt[6],
                ingredient_8_amount : amt[7],
            }
        });

        if(recipe) return {
            success : true,
            itemName : resultName
        }

    }
}