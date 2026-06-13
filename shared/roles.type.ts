import type { UserRole } from "../backend/src/generated/prisma/client";
import type { PaginatedResponse } from "../backend/src/types/api.types";

export interface ManagedUserDTO {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface GetManagedUsersProps {
  page: number;
  limit: number;
  search?: string;
}

export type ManagedUsersResponse = PaginatedResponse<ManagedUserDTO>;
