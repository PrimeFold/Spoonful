export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
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
