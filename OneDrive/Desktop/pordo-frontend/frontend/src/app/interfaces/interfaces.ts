import { UserRole } from "../../generated/prisma/enums";


export interface IErrorSorcess{
    statusCode?:number;
    path:string;
    message:string;
}

export interface TErrorResponse{
    success:boolean;
    message:string;
    statusCode:number;
    stack?:string;
    error?:string;
    errorSorcess:IErrorSorcess[];
}


export interface IRequestUser {
    userId:string;
    role: UserRole;
    email:string;
}
