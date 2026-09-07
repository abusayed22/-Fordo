



export interface ILoginResponse {
    token: string,
    accessToken: string,
    refreshToken: string
    user: {
        name: string,
        email: string,
        emailVerified: boolean,
        image?: string,
        createdAt: string,
        updatedAt: string,
        role: string,
        status: string,
        isDeleted: boolean,
        needPasswordChange: boolean

    }
}


export interface IRegisterResponse {
    token: string,
    accessToken: string,
    refreshToken: string
    user: {
        name: string,
        email: string,
        emailVerified: boolean,
        image?: string,
        createdAt: string,
        updatedAt: string,
        role: string,
        status: string,
        isDeleted: boolean,
        needPasswordChange: boolean

    }
}