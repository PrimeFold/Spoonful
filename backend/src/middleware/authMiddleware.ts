import type { NextFunction , Response , Request } from "express"
import { auth } from "../lib/auth/auth"
import type { Session, User } from "better-auth"

declare global{
    namespace Express{
        interface Request{
            user?: User,
            session?: Session
        }
    }
}


export async function authMiddleware(req:Request, res:Response, next:NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session) {
      return res.status(401).json({
        message: "Unauthorized",
      })
    }

    req.user = session.user;
    req.session = session.session;

    if (!req.user?.emailVerified) {
      return res.status(403).json({
        message: "Verify email first !"
      })
    }

    next()
  } catch (error) {
    next(error)
  }
}