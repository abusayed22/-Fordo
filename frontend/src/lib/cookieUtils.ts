import { cookies } from "next/headers";


const setCookie = async (name: string, value: string, age: number) => {

    const cookie = await cookies();
    cookie.set(name, value, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: age,
    })

}


const getCookie = async (name: string) => {
    const cookie = await cookies();

    const cookieValue = cookie.get(name);
    return cookieValue?.value
};


const deleteCookie = async (name: string) => {
    const cookie = await cookies();
    cookie.delete(name)
}


export const cookieUtils = {
    setCookie,
    getCookie,
    deleteCookie
}