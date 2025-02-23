type UserType = {
    id: string,
    name: string,
    password: string,
    email: string | null,
    phone: string | null,
    role: "ADMIN" | "AUTHOR" | "CUSTOMER",
    createdAt: Date,
    updatedAt: Date
}
type PaginationType = {
    allPage: number,
    nextPage: number,
    prevPage: number
}
export type {
    UserType,
    PaginationType
}