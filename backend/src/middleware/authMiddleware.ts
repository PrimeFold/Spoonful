import type { NextFunction, Request, Response } from "express";
import type { Session as AuthSession } from "better-auth";
import { auth, prisma } from "../lib/auth/auth";
import type { User as DbUser, UserRole } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: DbUser;
      session?: AuthSession;
    }
  }
}

const roleRank: Record<UserRole, number> = {
  STUDENT: 1,
  ADMIN: 2,
  OWNER: 3,
};

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!dbUser) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!dbUser.emailVerified) {
      return res.status(403).json({
        message: "Verify email first!",
      });
    }

    req.user = dbUser;
    req.session = session.session;


    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(minRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (roleRank[req.user.role] < roleRank[minRole]) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
}
