

import { Address } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateAddressPayload, IUpdateAddressPayload } from "./address.interface";



const addressCreate = async (payload: ICreateAddressPayload): Promise<Address> => {
    if (payload.isDefault) {
        await prisma.address.updateMany({
            where: { userId: payload.userId },
            data: { isDefault: false },
        });
    }

    const address = await prisma.address.create({
        data: payload,
    });

    return address;
};


const getAddressesByUser = async (userId: string) => {
    const addresses = await prisma.address.findMany({
        where: { userId,isDeleted:false },
        orderBy: { isDefault: "desc" },
    });

    return addresses;
};

const getAddressById = async (id: string, userId: string) => {
    const address = await prisma.address.findMany({
        where: { id, userId,isDeleted:false },
    });

    if (!address) {
        throw new Error("Address not found");
    }

    return address;
};

// unnessecery TODO:
// const addressGet = async (): Promise<Address[]> => {
//     const address = await prisma.address.findMany({
//         where: {
//             isDelete: false
//         }
//     });
//     return address;
// }

const addressDelete = async (id: string, userId: string) => {

    const existingAddress = await prisma.address.findFirst({
        where: { id, userId, isDeleted: false },
    });

    if (!existingAddress) {
        throw new Error("Address not found or unauthorized");
    }

    const address = await prisma.address.update({
        where: {
            id,
            userId
        },
        data: {
            isDeleted: true
        }
    })
    return address;
}

const addressUpdate = async (id: string, userId: string, payload: IUpdateAddressPayload) => {

    const existingAddress = await prisma.address.findFirst({
        where: {
            id,
            userId,
            isDeleted: false,
        },
    });

    if (!existingAddress) {
        throw new Error("Address not found or unauthorized");
    }

    if (payload.isDefault) {
        await prisma.address.updateMany({
            where: {
                userId,
                isDeleted: false,
            },
            data: {
                isDefault: false,
            },
        });
    }

    const updatedAddress = await prisma.address.update({
        where: {
            id: existingAddress.id,
        },
        data: payload,
    });
    return updatedAddress;
}




export const AddressService = { addressUpdate, addressDelete, addressCreate, getAddressesByUser, getAddressById }

