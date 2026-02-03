import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

const hashRefreshToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (providedPassword: string, storedHashedPassword: string) => {
  const isTrue = await bcrypt.compare(providedPassword, storedHashedPassword);
  if (!isTrue) throw new UnauthorizedException('رمز وارد شده اشتباه است');
};

const compareHashRefreshToken = (providedToken: string, storedTokenHash: string): boolean => {
  const providedTokenHash = hashRefreshToken(providedToken)
  return providedTokenHash === storedTokenHash;
}

export {
  hashRefreshToken,
  hashPassword,
  comparePassword,
  compareHashRefreshToken
}