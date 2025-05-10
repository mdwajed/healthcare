import { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        role: UserRole;
        id: string;
      };
    }
  }
}
export {};
