export interface User {
  userId: string;
  username: string;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  userId: string;
  username: string;
  roles: string[];
  permissions: string[];
}
