import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";
interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
const generateToken = (
  payload: JwtPayload,
  secret: Secret,
  expiresIn: StringValue
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};
const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
export const jwtHelper = {
  generateToken,
  verifyToken,
};
