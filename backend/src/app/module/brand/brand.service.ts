import { Brand } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"



const createBrand = async(payload:Brand):Promise<Brand> => {
    const brand = await prisma.brand.create({
        data:payload
    })
    return brand;
}

const brandFetch = async() :Promise<Brand[]>=> {
    const brand = await prisma.brand.findMany({
        // where:{}
    })
    return brand;
}

const brandDelete = async(id:string) => {
    const brand = await prisma.brand.delete({
        where: {
            id
        }
    })
    return brand;
}
const brandUpdate = async(id:string,payload:Partial<Brand>) => {
    const {name} = payload
    const brand = await prisma.brand.update({
        where: {
            id
        },
        data:{
                name
            }
    })
    return brand;
}



export const BrandService = {createBrand,brandFetch,brandDelete,brandUpdate};