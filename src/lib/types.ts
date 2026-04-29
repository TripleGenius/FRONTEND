export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  plainPassword?: string | null;
  createdAt?: string;
}

export interface Module {
  id: string;
  slug: string;
  icon: string;
  color: string;
  order: number;
}

export interface Question {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  order: number;
}

export interface Progress {
  moduleSlug: string;
  icon: string;
  color: string;
  completed: number;
  total: number;
  progress: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
