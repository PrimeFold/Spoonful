import { prisma } from "../../lib/auth/auth";

export const AuthRepository = {
    async SaveOTPtoDb(hashedOtp:string,email:string){
         return await prisma.oTP.create({
            data: {
              email,
              otp: hashedOtp,
              expireAt: new Date(Date.now() + 10 * 60 * 1000),
            },
         });
    },

    async FindOTPHash(email:string){
        return await prisma.oTP.findFirst({
          where: {
            email,
            expireAt: {
              gt: new Date(),
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
    },

    async UpdatedUserVefifiedStatus(email:string){
        return await prisma.user.update({
          where: { email },
          data: {
            emailVerified: true,
          },
        });
    },

    async deleteStoredOtp(email:string){
        return await prisma.oTP.deleteMany({
          where: { email },
        });
    }

}