export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'organizer';
  avatar?: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  organizer: string;
  organizerId: string;
  date: Date;
  time: string;
  location: string;
  capacity: number;
  price: number;
  category: string;
  tags: string[];
  image: string;
  bookings: number;
  status: 'active' | 'cancelled' | 'completed';
  createdAt: Date;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  quantity: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  registrationDate: Date;
  event?: Event;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}