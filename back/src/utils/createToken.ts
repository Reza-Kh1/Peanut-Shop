import token from 'jsonwebtoken';
const createToken = (value: object) => {
  return token.sign(value, process.env.TOKEN_SECURITY as string, {
    expiresIn: '5d',
  });
};
export default createToken;
