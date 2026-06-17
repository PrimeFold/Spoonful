import { prisma } from "../../lib/auth/auth"
import type { Prisma, UserRole } from "../../generated/prisma/client"

const USER_MANAGEMENT_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

const toManagedUserDTO = <T extends {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}>(user: T) => ({
  ...user,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

export const RolesRepository = {
  async PromoteToAdmin(userId:string){
    const user = await prisma.user.findUnique({
      where:{
        id:userId
      },
      select:{
        id:true,
        role:true
      }
    })

    if(!user || user.role !== "STUDENT"){
      return null;
    }

    const updated = await prisma.user.update({
      where:{
        id:userId
      },
      data:{
        role:"ADMIN"
      },
      select: USER_MANAGEMENT_SELECT
    })

    return toManagedUserDTO(updated);
  },

  async DemoteToStudent(userId:string){
    const user = await prisma.user.findUnique({
      where:{
        id:userId
      },
      select:{
        id:true,
        role:true
      }
    })

    if(!user || user.role !== "ADMIN"){
      return null;
    }

    const updated = await prisma.user.update({
      where:{
        id:userId
      },
      data:{
        role:"STUDENT"
      },
      select: USER_MANAGEMENT_SELECT,

    })

    return toManagedUserDTO(updated);
  },

  async GetAllAdmins(){
    const admins = await prisma.user.findMany({
      where:{
        role:"ADMIN"
      },
      select:USER_MANAGEMENT_SELECT
    })

    return admins.map(toManagedUserDTO);
  },

  async GetAllStudents(skip:number, take:number, search?:string){
    const where: Prisma.UserWhereInput = {
      role:"STUDENT",
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: USER_MANAGEMENT_SELECT,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      students: students.map(toManagedUserDTO),
      total,
    };
  },

  async CountAdmins(){
    return prisma.user.count({
      where:{
        role:"ADMIN"
      }
    })
  },

  async CreateAdminAction(adminId: string, action: string, targetId: string, metadata: any) {
    return prisma.adminAction.create({
      data: {
        adminId,
        action,
        targetId,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
      },
    });
  },

  async GetRecentAdminActions(limit: number = 50) {
    return prisma.adminAction.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async GetSubmittedSpots(skip: number, take: number, search?: string) {
    const where: Prisma.FoodSpotsWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { user: { name: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};

    const [spots, total] = await Promise.all([
      prisma.foodSpots.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          location: true,
        },
      }),
      prisma.foodSpots.count({ where }),
    ]);

    return {
      spots: spots.map(s => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
        verifiedAt: s.verifiedAt ? s.verifiedAt.toISOString() : null,
      })),
      total,
    };
  },

  async GetSubmittedSpotsCreationDates() {
    return prisma.foodSpots.findMany({
      select: {
        createdAt: true,
      },
    });
  }
}

