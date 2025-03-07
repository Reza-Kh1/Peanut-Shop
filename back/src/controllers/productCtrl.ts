import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { customError } from '../middlewares/globalError';
import { Response } from 'express';
import pagination from '../utils/pagination';
import token from 'jsonwebtoken';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE) || 5;
const generateRefCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 7; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const getProduct = asyncHandler(async (req, res: Response) => {
  const {
    category,
    page = 1,
    order = 'desc',
    name,
    desc,
    isStatus,
    isAvailable,
    refCode,
    price,
  } = req.query;
  try {
    const searchProduct = {} as any;
    if (category || isStatus || isAvailable) {
      searchProduct.AND = [
        category ? { categoryId: Number(category) } : {},
        isStatus ? { isStatus: true } : {},
        isAvailable ? { isAvailable: true } : {},
      ];
    }
    if (name || desc || refCode) {
      searchProduct.OR = [
        name ? { name: name.toString() } : {},
        desc ? { description: desc?.toString() } : {},
        refCode ? { refCode: refCode.toString() } : {},
      ];
    }

    const data = await prisma.product.findMany({
      where: searchProduct,
      select: {
        slug: true,
        name: true,
        description: true,
        gallery: true,
        rating: true,
        refCode: true,
        totalComment: true,
        updatedAt: true,
        isAvailable: true,
        isStatus: true,
        price: true,
        Discount: {
          select: {
            discount: true,
            endDate: true,
            startDate: true,
            type: true
          }
        },
        Comment: true,
        Category: true,
      },
      skip: (Number(page) - 1) * pageLimit,
      take: pageLimit,
      orderBy: { createdAt: order as 'desc' | 'asc' },
    });
    const count = await prisma.product.count({ where: searchProduct });
    const pager = pagination(count, Number(page), pageLimit);
    res.send({ data: data, pagination: pager });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});
const getSingleProduct = asyncHandler(async (req, res: Response) => {
  const { id } = req.params;
  try {
    const data = await prisma.product.findUnique({
      where: { slug: id?.toString() },
      include: {
        Category: true,
        Comment: {
          where: { isApproved: true },
          select: {
            name: true,
            id: true,
            content: true,
            createdAt: true,
            rating: true,
          },
          skip: (1 - 1) * pageLimit,
          take: pageLimit,
          orderBy: { createdAt: 'desc' },
        },
        User: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });
    res.send({ ...data });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});
const createProduct = asyncHandler(async (req, res: Response) => {
  const {
    isStatus,
    slug,
    name,
    gallery,
    description,
    tags,
    price,
    weight,
    stock,
    detail,
    discountId,
    categoryId, isAvailable
  } = req.body;

  try {
    const cookieKey = process.env.COOKIE_KEY as string;
    const cookie = req.cookies[cookieKey];
    const tokenUser = token.verify(
      cookie,
      process.env.TOKEN_SECURITY as string,
    ) as { id: string };
    await prisma.product.create({
      data: {
        name: name,
        isAvailable: isAvailable || undefined,
        isStatus: isStatus || undefined,
        refCode: generateRefCode(),
        slug,
        gallery: gallery || [],
        description: description || undefined,
        tags: tags || [],
        price: price || 0,
        weight: weight || 0,
        stock: Number(stock) || 0,
        detail: detail || undefined,
        userId: tokenUser.id,
        discountId: discountId || undefined,
        categoryId,
      },
    });
    res.send({ success: true });
  } catch (err) {
    console.log(err);
    throw customError('خطا در دیتابیس', 500, err);
  }
});
const updateProduct = asyncHandler(async (req, res: Response) => {
  const {
    isAvailable,
    isStatus,
    slug,
    name,
    gallery,
    description,
    tags,
    price,
    weight,
    stock,
    detail,
    discountId,
    categoryId,
  } = req.body;
  const { id } = req.params;
  try {
    await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: name || undefined,
        isAvailable: isAvailable,
        isStatus: isStatus,
        slug: slug || undefined,
        gallery: gallery?.length ? gallery : null,
        description: description ? description : null,
        tags: tags ? tags : null,
        price: price ? price : null,
        weight: weight ? weight : null,
        stock: stock ? stock : null,
        detail: detail || undefined,
        discountId: discountId ? discountId : null,
        categoryId: categoryId || undefined,
      },
    });
    res.send({ success: true });
  } catch (err) {
    console.log(err);

    throw customError('خطا در دیتابیس', 500, err);
  }
});
const deleteProduct = asyncHandler(async (req, res: Response) => {
  const { id } = req.query;
  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

export {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
};
