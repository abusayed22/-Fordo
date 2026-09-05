import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";



const categoryCreate = async(payload:Category):Promise<Category> => {
    const category = await prisma.category.create({
        data:payload
    })
    return category;
}

const categoryGet = async() :Promise<Category[]>=> {
    const category = await prisma.category.findMany({
        where:{
                isDeleted:false
        }
    });
    return category;
}

const CategoryDelete = async(id:string) => {
    const category = await prisma.category.update({
        where: {
            id
        },
        data:{
            isDeleted: true
        }
    })
    return category;
}

const categoryUpdate = async(id:string,payload:Partial<Category>) => {
    const {name,logo} = payload;
    const category = await prisma.category.update({
        where: {
            id
        },
        data:{
                name:name,
                logo:logo
            }
    })
    return category;
}




export const CategoryService = {categoryUpdate,CategoryDelete,categoryGet,categoryCreate}

