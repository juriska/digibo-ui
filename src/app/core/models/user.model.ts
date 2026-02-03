export interface User {
  userId: string;
  username: string;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  accessToken: string | null;  // null when using httpOnly cookies
  refreshToken: string | null; // null when using httpOnly cookies
  tokenType: string;
  userId: string;
  username: string;
  roles: string[];
  permissions: string[];
}

export interface DecodedToken {
  sub: string;
  userId: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}
