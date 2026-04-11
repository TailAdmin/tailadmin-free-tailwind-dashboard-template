export interface AssignmentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Assignment {
  id: string;
  user: AssignmentUser;
  email: string;
  id_store: string;
  comentario: string;
  image_url: string;
  autorizado: boolean;
  createdAt: string;
  updatedAt: string;
}
