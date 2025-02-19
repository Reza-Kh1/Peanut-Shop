import { PrismaClient } from "@prisma/client"
import asyncHandler from "express-async-handler"
import { customError } from "../middlewares/globalError"
import { Response } from "express"
import { createHash } from "../utils/hashPassword"
import token from "jsonwebtoken"
import pagination from "../utils/pagination"
const prisma = new PrismaClient()
const getUsers = asyncHandler(async (req, res: Response) => {
    const { email, phone, role, name } = req.query
    try {
        const emailVlue = email?.toString()
        const phoneVlue = phone?.toString()
        const roleVlue = role?.toString() as any
        const nameVlue = name?.toString()
        const data = await prisma.user.findMany({
            where: {
                AND: [
                    emailVlue ? { email: emailVlue } : {},
                    phoneVlue ? { phone: phoneVlue } : {},
                    roleVlue ? { role: roleVlue } : {},
                    nameVlue ? { name: { contains: nameVlue, mode: 'insensitive' } } : {},
                ],
            },
        });

        // const pages = pagination(count, pageXOffset, limit)
        res.send({ data: data })
    } catch (err) {
        customError("خطا در دیتابیس", 500, err)
    }
})
const createUser = asyncHandler(async (req, res: Response) => {
    const { name, email, password, phone, role } = req.body
    const hash = await createHash(password)
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone },
                ],
            },
        });
        if (existingUser) {
            if (existingUser.email === email) {
                res.status(400).send({ message: "با این ایمیل ثبت نام شده است" });
                return
            }
            if (existingUser.phone === phone) {
                res.status(400).send({ message: "بااین شماره تلفن ثبت نام شده است" });
                return
            }
        }
        await prisma.user.create({ data: { name, email, password: hash, phone, role } })
        res.send({ success: true })
    } catch (err) {
        customError("خطا در دیتابیس", 500, err)
    }
})
const deleteUser = asyncHandler(async (req, res: Response) => {
    const { id } = req.params
    try {
        await prisma.user.delete({ where: { id: id } })
        res.send({ success: true })
    } catch (err) {
        customError("خطا در دیتابیس", 500, err)
    }
})
const updateUser = asyncHandler(async (req, res: Response) => {
    const { name, email, phone, password, role } = req.body;
    const { id } = req.params
    const cookie = req.cookies?.peanutUser;
    const tokenUser = token.verify(cookie, process.env.TOKEN_SECURITY as string) as { id: string, role: "ADMIN" | "CUSTOMER" | "AUTHOR" }
    if (tokenUser.role !== "ADMIN" && tokenUser.id !== id) {
        res.status(403).json({ message: "مجاز به این عملیات نیستید" });
        return
    }
    let hash
    if (password) {
        hash = await createHash(password);
    }
    try {
        await prisma.user.update({
            where: { id: id },
            data: {
                name: name || undefined,
                email: email || undefined,
                phone: phone || undefined,
                password: hash || undefined,
                role: role || undefined,
            },
        });
        res.send({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating user" });
    }
});
export {
    getUsers,
    createUser,
    deleteUser,
    updateUser

}