import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { customError } from '../middlewares/globalError';
import { Response } from 'express';
const prisma = new PrismaClient();
const getCategory = asyncHandler(async (req, res: Response) => {
  const { admin } = req.query;
  try {
    let data;
    if (admin) {
      data = await prisma.category.findMany({
        select: { name: true, id: true, subCategorys: true },
      });
    } else {
      data = await prisma.category.findMany({
        where: { subCategoryId: null },
        select: {
          name: true,
          id: true,
          subCategorys: {
            select: {
              subCategorys: true,
              name: true,
              id: true,
            },
          },
        },
      });
    }
    res.send({ data });
  } catch (err) {
    customError('خطا در دیتابیس', 500, err);
  }
});

const createCategory = asyncHandler(async (req, res: Response) => {
  const { subCategoryId, name } = req.body;
  try {
    await prisma.category.create({
      data: {
        name: name,
        subCategoryId: subCategoryId || undefined,
      },
    });
    res.send({ success: true });
  } catch (err) {
    customError('خطا در دیتابیس', 500, err);
  }
});
const updateCategory = asyncHandler(async (req, res: Response) => {
  const { subCategoryId, name } = req.body;
  const { id } = req.params;
  try {
    await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name || undefined,
        subCategoryId: subCategoryId || undefined,
      },
    });
    res.send({ success: true });
  } catch (err) {
    customError('خطا در دیتابیس', 500, err);
  }
});
const deleteCategory = asyncHandler(async (req, res: Response) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.category.delete({ where: { id: Number(id) } });
    res.send({ success: true });
  } catch (err) {
    customError('خطا در دیتابیس', 500, err);
  }
});
export { getCategory, createCategory, updateCategory, deleteCategory };
