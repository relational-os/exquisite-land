import jwt, { JwtPayload } from 'jsonwebtoken';
import { verifyMessage } from '@ethersproject/wallet';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('Missing environment variable: JWT_SECRET');
}

export const createLinkAddressMessage = (userId: string) => {
  const token = jwt.sign({ userId }, jwtSecret);
  return `ALL HAIL KING SEAWORM\n\n\n${token}`;
};

export const verifyLinkAddressMessage = (
  message: string,
  signature: string,
  expectedAddress: string
) => {
  const address = verifyMessage(message, signature);
  if (address.toLowerCase() !== expectedAddress.toLowerCase()) {
    throw new Error('Message was not signed with expected address');
  }

  const token = message.trim().replace(/^[\s\S]+\n/m, '');
  const { userId } = jwt.verify(token, jwtSecret, {
    maxAge: '1h'
  }) as JwtPayload;

  if (!userId) {
    throw new Error('Missing userId in JWT payload');
  }

  return { userId, address };
};
