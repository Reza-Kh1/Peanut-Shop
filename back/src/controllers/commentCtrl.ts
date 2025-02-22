import { PrismaClient } from "@prisma/client"
import asyncHandler from "express-async-handler"
import { customError } from "../middlewares/globalError"
import { Response } from "express"
const pageLimit = Number(process.env.PAGE_LIMITE) || 5;

const prisma = new PrismaClient()
const createComment = asyncHandler(async (req, res: Response) => {
    const { isApproved, name, phone, email, content, rating, productId } = req.body
    try {
        await prisma.comment.create({
            data: {
                content: content,
                email: email,
                name: name,
                phone: phone,
                isApproved: isApproved || undefined,
                productId: productId,
                rating: rating || undefined,
            }
        })
        res.send({ success: true });
    } catch (err) {
        console.error(err);
        throw customError("Error in Comment", 500, err)
    }
});
const updateComment = asyncHandler(async (req, res: Response) => {
    const { isApproved, name, phone, email, content, rating, productId } = req.body
    const { id } = req.params
    try {
        const [updatedComment, product] = await Promise.all([
            prisma.comment.update({
                where: { id: Number(id) },
                data: {
                    content,
                    email,
                    name,
                    phone,
                    isApproved: isApproved || undefined,
                    productId,
                    rating: rating || undefined,
                }
            }),
            isApproved
                ? prisma.product.findUnique({
                    where: { id: productId },
                    select: { rating: true, totalComment: true }
                })
                : null
        ]);
        if (isApproved && product) {
            const newTotalComment = Number(product?.totalComment) + 1;
            const newRating = ((Number(product?.rating) * Number(product.totalComment)) + rating) / newTotalComment;
            await prisma.product.update({
                where: { id: productId },
                data: {
                    rating: newRating,
                    totalComment: newTotalComment
                }
            });
        }
        res.send({ success: true });
    } catch (err) {
        console.error(err);
        throw customError("Error in Comment", 500, err)
    }
});
const getAllComment = asyncHandler(async (req, res: Response) => {
    const { page = 1, productId } = req.query
    try {
        let data
        if (productId) {
            data = await prisma.comment.findMany({
                where: { productId: Number(productId), isApproved: true },
                skip: (Number(page) - 1) * pageLimit,
                take: pageLimit,
                orderBy: { createdAt: 'desc' },
            })
        } else {
            data = await prisma.comment.findMany({
                skip: (Number(page) - 1) * pageLimit,
                take: pageLimit,
                orderBy: { createdAt: 'desc' },
            })
        }
        res.send({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error Comment" });
    }
});
const deleteComment = asyncHandler(async (req, res: Response) => {
    const { id } = req.params
    const { productId } = req.query
    try {
        const [deletedComment, product] = await Promise.all([
            prisma.comment.delete({ where: { id: Number(id) } }),
            prisma.product.findUnique({
                where: { id: Number(productId) },
                select: { rating: true, totalComment: true }
            })
        ]);
        if (deletedComment.isApproved && product) {
            const totla = Number(product.totalComment)
            const ratingProduct = Number(product.rating)
            const newTotalComment = totla > 1 ? totla - 1 : 0;
            const newRating = newTotalComment > 0
                ? ((ratingProduct * totla) - Number(deletedComment.rating)) / newTotalComment
                : 0;
            await prisma.product.update({
                where: { id: deletedComment.productId },
                data: {
                    rating: newRating,
                    totalComment: newTotalComment
                }
            });
        }
        res.send({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating user" });
    }
});
export {
    createComment,
    updateComment,
    getAllComment,
    deleteComment
}