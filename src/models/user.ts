export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt?: string;
  disabled?: boolean;
}

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  disabled?: boolean;
};

export type APIError = {
  message?: string;
  errors?: Record<string, string>;
};

export default User;
