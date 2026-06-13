
import type { PaginatedResponse } from "../backend/src/types/api.types";

export type UserRole = 'STUDENT' | 'ADMIN' | 'OWNER';

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
