import type { CreateUserPayload } from '../models/user';

export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

export const validatePassword = (password: string) => {
  return typeof password === 'string' && password.length >= 8;
};

export const validatePhone = (phone?: string) => {
  if (!phone) return true; // opcional
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

export const validateRole = (role: string) => {
  const allowed = ['SUPER_USER', 'SECONDARY_USER', 'ADMIN'];
  return allowed.includes(role);
};

export const validateName = (name: string) => {
  return typeof name === 'string' && name.trim().length >= 2;
};

export const validateUserForm = (data: CreateUserPayload) => {
  const errors: Record<string, string> = {};

  if (!validateName(data.name)) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  }

  if (!validateEmail(data.email)) {
    errors.email = 'Email inválido';
  }

  if (!validatePassword(data.password)) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }

  if (!validateRole(data.role)) {
    errors.role = 'Rol inválido';
  }

  if (!validatePhone(data.phone)) {
    errors.phone = 'Teléfono inválido';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validateUserForm;
