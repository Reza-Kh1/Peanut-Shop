import { PrismaClient } from "@prisma/client"
import asyncHandler from "express-async-handler"
import { customError } from "../middlewares/globalError"
import { Response } from "express"
const prisma = new PrismaClient()
const getAddress = asyncHandler(async (req, res: Response) => {
    const { id } = req.params
    try {
        const data = await prisma.addressUser.findMany({ where: { userId: id } })
        res.send({ data: data })
    } catch (err) {
        customError("خطا در دیتابیس", 500, err)
    }
})
const createAddress = asyncHandler(async (req, res: Response) => {
    const { adrress, name, phone, userId } = req.body
    try {
        await prisma.addressUser.create({ data: { adrress, name, phone, userId } })
        res.send({ success: true })
    } catch (err) {
        customError("خطا در دیتابیس", 500, err)
    }
})
const updateAddress = asyncHandler(async (req, res: Response) => {    
    const { adrress, name, phone } = req.body
    const { id } = req.params
    try {
        await prisma.addressUser.update({
            where: { id: Number(id) }, data: {
                adrress: adrress || undefined,
                name: name || undefined,
                phone: phone || undefined,
            }
        })
        res.send({ success: true })
    } catch (err) {
        customError("خطا در دیتابیس", 500, err)
    }
})
const deleteAddress = asyncHandler(async (req, res: Response) => {
    const { id } = req.params
    try {
        await prisma.addressUser.delete({ where: { id: Number(id) } })
        res.send({ success: true })
    } catch (err) {
        customError("خطا در دیتابیس", 500, err)
    }
})
export {
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress
}