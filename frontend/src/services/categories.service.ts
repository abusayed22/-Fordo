"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICategoresData } from "@/types/categories.types";
import { IAdminDashboardData } from "@/types/dashboard.types";


export async function getCategoriesData() {
    try {
    const response = await httpClient.get<ICategoresData[]>("/category")
        

        return response;
    } catch (error : any) {
      console.log(error, "Category Server Action");
      return {
        success: false,
        message: error.message || "An error occurred while fetching dashboard data.",
        data: null,
        meta: null,
      }  
    }
}

export async function createCategoryData(formData: FormData) {
  try {
    return await httpClient.post("/category", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    process.env.NODE_ENV === "development" && console.log(error, "Category Create Server Action");
    return {
      success: false,
      message: error.message || "An error occurred while creating the category.",
      data: null,
      meta: null,
    };
  }
}


export const categoryUpdate = async(formData: FormData) => {
  try{
    const rawData = formData.get("data") as string;
    const data = JSON.parse(rawData) as ICategoresData;
    return await httpClient.patch(`/category/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

  }catch(error: any){
    process.env.NODE_ENV === "development" && console.log(error, "Category Update Server Action");
    return {
      success: false,
      message: error.message || "An error occurred while updating the category.",
      data: null,
      meta: null,
    };
  }
}

export const categoryDelete = async(id: string) => {
  try{
    return await httpClient.delete(`/category/${id}`, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

  }catch(error: any){
    process.env.NODE_ENV === "development" && console.log(error, "Category Delete Server Action");
    return {
      success: false,
      message: error.message || "An error occurred while delete the category.",
      data: null,
      meta: null,
    };
  }
}