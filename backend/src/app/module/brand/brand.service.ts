import { Brand } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"



const createBrand = async(payload:Brand):Promise<Brand> => {
    const brand = await prisma.brand.create({
        data:payload
    })
    return brand;
}

const brandFetch = async() => {
    const brand = await prisma.brand.findMany({
        // where:{}
    })
    return brand;
}



export const BrandService = {createBrand,brandFetch};