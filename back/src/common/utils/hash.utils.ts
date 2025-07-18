import crypto from 'crypto';

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const compareToken=(providedToken: string, storedTokenHash: string): boolean =>{
  const providedTokenHash = hashToken(providedToken);
  return providedTokenHash === storedTokenHash;
}

export {
    hashToken,compareToken
}