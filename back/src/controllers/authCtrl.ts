import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { createHash, comaprePassword } from '../utils/hashPassword';
import { customError } from '../middlewares/globalError';
import nodemailer from 'nodemailer';
import createToken from '../utils/createToken';
import { Response } from 'express';
import Ghasedak from '../middlewares/sms';
const apiKey = process.env.API_KEY_GHASEDAK as string;
const templateGhasedak = process.env.TEMPLATE_GHASEDAK as string;
const prisma = new PrismaClient();
const sendSms = async ({
  phone,
  password,
}: {
  phone: string;
  password: string;
}) => {
  let ghasedak = new Ghasedak(apiKey);
  const receptor = phone;
  const template = templateGhasedak;
  const param1 = password;
  const { result } = await ghasedak.verification({
    receptor,
    type: 8,
    template,
    param1,
  });
  if (result?.code === 200) {
    return true;
  } else {
    return false;
  }
};

const signUp = asyncHandler(async (req, res: Response) => {
  const { name, email, password, phone } = req.body;
  const admin = await prisma.user.findFirst();
  const hash = await createHash(password);
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
    if (existingUser) {
      if (existingUser.email === email) {
        res.status(400).send({ message: 'با این ایمیل ثبت نام شده است' });
        return;
      }
      if (existingUser.phone === phone) {
        res.status(400).send({ message: 'بااین شماره تلفن ثبت نام شده است' });
        return;
      }
    }
    let data;
    if (!admin) {
      data = await prisma.user.create({
        data: { name, email, password: hash, phone, role: 'ADMIN' },
      });
    } else {
      data = await prisma.user.create({
        data: { name, email, password: hash, phone },
      });
    }
    data.password = '';
    if (data.role !== 'CUSTOMER') {
      const token = createToken(data);
      res.cookie('PEANUT_USER', token, {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000,
      });
    }
    res.send({ ...data });
  } catch (err: any) {
    throw customError(err?.message || "خطا در ارتباط با دیتابیس", 500, err);
  }
});
const signIn = asyncHandler(async (req, res: Response) => {
  const { email, password, phone } = req.body;
  let dataUser;
  try {
    if (phone) {
      dataUser = await prisma.user.findUnique({ where: { phone } });
    } else if (email) {
      dataUser = await prisma.user.findUnique({ where: { email } });
    }
    if (!dataUser) {
      res.status(404).send({ message: 'کاربر مورد نظر ثبت نشده است' });
      return;
    }
    await comaprePassword(password, dataUser?.password);
    dataUser.password = '';
    if (dataUser.role !== 'CUSTOMER') {
      const token = createToken(dataUser);
      res.cookie('PEANUT_USER', token, {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000,
      });
    }
    res.send({ ...dataUser });
  } catch (err: any) {
    throw customError(err?.message || "خطا در ارتباط با دیتابیس", 500, err);
  }
});
const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const verify = await prisma.user.findUnique({ where: { email } });
    if (!verify)
      throw new Error(
        'با این ایمیل کسی ثبت نام نکرده است لطفا ایمیل صحیح وارد کنید ',
      );
    const newPass = [...Array(8)]
      .map(() => (~~(Math.random() * 36)).toString(36))
      .join('');
    const transporter = nodemailer.createTransport({
      port: 465,
      secure: true,
      service: 'gmail',
      auth: {
        user: 'emailwebsite2024@gmail.com',
        pass: 'hexh zbsk orwh tinr',
      },
    });
    const mailOptions = {
      from: 'emailwebsite2024@gmail.com',
      to: email,
      subject: 'باز نشانی رمز عبور ',
      text: `پس از ورود به حساب کاربری رمز عبور خود را تغییر دهید  .رمز عبور : ${newPass}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw customError('خطا در تغییر رمز', 404, error);
      }
    });
    await prisma.user.update({
      where: { email },
      data: { password: await createHash(newPass) },
    });
    res.send({ message: 'رمز عبور جدید به ایمیل شما ارسال شد' });
  } catch (err) {
    throw customError(err as string, 404, err);
  }
});
const signOut = asyncHandler(async (req, res: Response) => {
  res.cookie('PEANUT_USER', '', { expires: new Date(0) });
  res.send({ success: true });
});
export { signIn, signUp, signOut, forgetPassword };
