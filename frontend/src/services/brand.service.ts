"use server";

import type { IBrandData } from "@/components/modules/brand/brandColumn";
import { httpClient } from "@/lib/axios/httpClient";




export async function getBrandsData() {
    try {
  const response = await httpClient.get<IBrandData[]>("/brand")
        

        return response;
    } catch (error : any) {
      console.log(error, "Brand Server Action");
      return {
        success: false,
        message: error.message || "An error occurred while fetching brands.",
        data: null,
        meta: null,
      }  
    }
}

export async function createBrandData(formData: FormData) {
  try {
    return await httpClient.post("/brand", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    process.env.NODE_ENV === "development" && console.log(error, "Brand Create Server Action");
    return {
      success: false,
      message: error.message || "An error occurred while creating the brand.",
      data: null,
      meta: null,
    };
  }
}


export const brandUpdate = async (formData: FormData) => {
  try{
    const rawData = formData.get("data") as string;
    const data = JSON.parse(rawData) as IBrandData;
    return await httpClient.patch(`/brand/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

  }catch(error: any){
    process.env.NODE_ENV === "development" && console.log(error, "Brand Update Server Action");
    return {
      success: false,
      message: error.message || "An error occurred while updating the brand.",
      data: null,
      meta: null,
    };
  }
}

export const brandDelete = async (id: string) => {
  try{
    return await httpClient.delete(`/brand/${id}`, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

  }catch(error: any){
    process.env.NODE_ENV === "development" && console.log(error, "Brand Delete Server Action");
    return {
      success: false,
      message: error.message || "An error occurred while deleting the brand.",
      data: null,
      meta: null,
    };
  }
}