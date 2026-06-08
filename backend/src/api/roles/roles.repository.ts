import { prisma } from "../../lib/auth/auth"

export const RolesRepository = {
  async PromoteToAdmin(userId:string){
    return prisma.user.update({
      where:{
        id:userId
      },
      data:{
        role:"ADMIN"
      }
    })
  },

  async DemoteToStudent(userId:string){
    return prisma.user.update({
      where:{
        id:userId
      },
      data:{
        role:"STUDENT"
      },

    })
  },

  async GetAllAdmins(){
    return prisma.user.findMany({
      where:{
        role:"ADMIN"
      },
      select:{
        id:true,
        name:true,
        email:true,
        image:true,
        createdAt:true,
        updatedAt:true,
        foodSpots:true,
        adminActions:true
      }
    })
  }
}