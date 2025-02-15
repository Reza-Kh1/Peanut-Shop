import { PrismaClient } from "@prisma/client"
import asyncHandler from "express-async-handler"
import { createHash, comaprePassword } from "../utils/hashPassword"
import { customError } from "../middlewares/globalError"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import createToken from "../utils/createToken"
import { Response } from "express"
import crypto from "crypto";
import Ghasedak from "../middlewares/sms"
const apiKey = process.env.API_KEY_GHASEDAK as string
const templateGhasedak = process.env.TEMPLATE_GHASEDAK as string
const prisma = new PrismaClient()
const createPass = async () => {
    const digits = "0123456789".split("");
    for (let i = digits.length - 1; i > 0; i--) {
        const j = crypto.randomInt(0, i + 1);
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    return digits.slice(0, 5).join("");
}
const loginExpert = asyncHandler(async (req, res: Response) => {
    const { password, phone } = req.body
    const dataExpert = await prisma.expert.findUnique({ where: { phone, isDelete: false } })
    if (!dataExpert) {
        throw customError("شماره مورد نظر ثبت نشده است", 404)
    }
    await comaprePassword(password, dataExpert?.password)
    sendCookie(res, dataExpert, "expert")
    res.send({ data: dataExpert })
})
const sendSms = async ({ phone, password }: { phone: string, password: string }) => {
    let ghasedak = new Ghasedak(apiKey);
    const receptor = phone;
    const template = templateGhasedak;
    const param1 = password;
    const { result } = await ghasedak.verification({ receptor, type: 8, template, param1 })
    if (result?.code === 200) {
        return true
    } else {
        return false
    }
}

export {
    signUpExpert,
    loginExpert,
    signUpCompany,
    loginCompany,
    forgetPass,
    logOutUser,
    verifyPassword
}