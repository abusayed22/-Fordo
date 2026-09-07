import z from "zod";

interface IRegisterPayload {
    name: string,
    email: string,
    password: string
}
interface ILoginPayload {
    email: string,
    password: string
}

export const registerSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(50),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
});