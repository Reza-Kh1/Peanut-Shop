import { PrismaClient } from "@prisma/client"
import asyncHandler from "express-async-handler"
import { customError } from "../middlewares/globalError"
import { Response } from "express"
import pagination from "../utils/pagination";
const pageLimit = Number(process.env.PAGE_LIMITE) || 5;

const prisma = new PrismaClient()
const getAllChat = asyncHandler(async (req, res: Response) => {
    const { chatId, isDone, page = 1 } = req.query
    try {
        if (chatId) {
            const data = await prisma.chat.findUnique({
                where: {
                    id: Number(chatId)
                },
                select: {
                    title: true,
                    isDone: true,
                    createdAt: true,
                    User: {
                        select: {
                            name: true,
                            phone: true,
                            email: true,
                        }
                    },
                    Message: {
                        select: {
                            content: true,
                            senderType: true,
                            createdAt: true,
                        }
                    }
                }
            })
            res.send({ data })
            return
        } else {
            const data = await prisma.chat.findMany({
                where: {
                    isDone: isDone ? true : false
                },
                include: {
                    User: {
                        select: {
                            name: true,
                            phone: true,
                            id: true
                        }
                    }
                },
                skip: (Number(page) - 1) * pageLimit,
                take: pageLimit,
            })
            const count = await prisma.chat.count({
                where: {
                    isDone: false
                }
            })
            const pages = pagination(count, Number(page), pageLimit)
            res.send({ data, pagination: pages })
        }
    } catch (err) {
        throw customError("خطا در دیتابیس", 500, err)
    }
})
const createChat = asyncHandler(async (req, res: Response) => {
    const { title, userId } = req.body
    try {
        await prisma.chat.create({
            data: {
                userId: userId,
                title: title,
            }
        })
        res.send({ success: true })
    } catch (err) {
        throw customError("خطا در دیتابیس", 500, err)
    }
})
const sendMessage = asyncHandler(async (req, res: Response) => {
    const { senderType, content, chatId, userId } = req.body
    try {
        await prisma.message.create({
            data: {
                content: content,
                senderType: senderType,
                chatId: chatId,
                userId: userId,
            }
        })
        await prisma.chat.update({
            data: {
                isDone: senderType === "CUSTOMER" ? false : true
            }, where: {
                id: chatId
            }
        })
        res.send({ success: true })
    } catch (err) {
        throw customError("خطا در دیتابیس", 500, err)
    }
})
const deleteMessage = asyncHandler(async (req, res: Response) => {
    const { id } = req.params
    try {
        await prisma.message.delete({
            where: {
                id: Number(id)
            }
        })
        res.send({ success: true })
    } catch (err) {
        throw customError("خطا در دیتابیس", 500, err)
    }
})
export {
    getAllChat,
    deleteMessage,
    createChat,
    sendMessage
}