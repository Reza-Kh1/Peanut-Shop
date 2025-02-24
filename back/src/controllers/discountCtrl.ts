import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { customError } from '../middlewares/globalError';
import { Response } from 'express';
import { isBefore } from 'date-fns';
const prisma = new PrismaClient();
const createDiscount = asyncHandler(async (req, res: Response) => {
  const { amount, code, type, discount, startDate, endDate } = req.body;
  try {
    await prisma.discount.create({
      data: {
        amount: amount || undefined,
        code: code || undefined,
        type,
        discount,
        startDate,
        endDate,
      },
    });
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    throw customError('Error in Discount', 500, err);
  }
});
const updateDiscount = asyncHandler(async (req, res: Response) => {
  const { amount, code, type, discount, startDate, endDate } = req.body;
  const { id } = req.params;
  try {
    await prisma.discount.update({
      where: { id: Number(id) },
      data: {
        amount: amount ? amount : null,
        code: code ? code : null,
        type,
        discount,
        startDate,
        endDate,
      },
    });
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    throw customError('Error in Discount', 500, err);
  }
});
const getAllDiscount = asyncHandler(async (req, res: Response) => {
  const { product } = req.query;
  try {
    const data = await prisma.discount.findMany({
      where: {
        code: product === 'true' ? null : {},
      },
    });
    res.send({ data });
  } catch (err) {
    console.error(err);
    throw customError('Error in Discount', 500, err);
  }
});
const deleteDiscount = asyncHandler(async (req, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.discount.delete({ where: { id: Number(id) } });
    res.send({ success: true });
  } catch (err) {
    throw customError('Error in Comment', 500, err);
  }
});
const checkDiscount = asyncHandler(async (req, res: Response) => {
  const { code } = req.query;
  try {
    const data = await prisma.discount.findUnique({
      where: { code: code?.toString() },
    });
    if (data?.amount) {
      res
        .status(404)
        .json({ message: 'تعداد استفاده از این کد تخفیف به پایان رسیده است' });
      return;
    }
    if (!data) {
      res.status(404).json({ message: 'کد تخفیف یافت نشد' });
      return;
    }
    if (data.endDate && isBefore(new Date(data.endDate), new Date())) {
      res.status(400).json({ message: 'کد تخفیف منقضی شده است' });
      return;
    }
    await prisma.discount.update({
      where: { code: code?.toString() },
      data: {
        amount: Number(data.amount) - 1,
      },
    });
    res.send({ ...data });
  } catch (err) {
    console.error(err);
    throw customError('Error in Discount', 500, err);
  }
});
export {
  createDiscount,
  updateDiscount,
  getAllDiscount,
  deleteDiscount,
  checkDiscount,
};
