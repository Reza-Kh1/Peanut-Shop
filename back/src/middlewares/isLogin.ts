import { NextFunction, Request } from 'express';
import token from 'jsonwebtoken';
import { customError } from './globalError';
const isLogin = (req: Request, res: any, next: NextFunction) => {
  const cookie = req.cookies?.PEANUT_USER;
  console.log("log cookie =====>", cookie);

  try {
    if (!cookie) throw new Error()
    token.verify(cookie, process.env.TOKEN_SECURITY as string);
    next();
  } catch (err) {
    throw customError('وارد حساب کاربری خود شوید.', 403);
  }
};
export default isLogin;
