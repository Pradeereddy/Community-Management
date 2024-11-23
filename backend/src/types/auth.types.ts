export interface User {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'Staff' | 'Resident';
  phone_number?: string;
  unit_number?: string;
}

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
} 