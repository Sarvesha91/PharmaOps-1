import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { getEnv } from '../config/env';
import { AppDataSource } from '../data/dataSource';
import { User } from '../entities/User';

export interface RegisterData {
  email: string;
  password: string;
  role?: User['role'];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(data: RegisterData): Promise<User> {
    const { email, password, role = 'vendor' } = data;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      email,
      passwordHash,
      role,
    });

    return this.userRepository.save(user);
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.role);

    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  private generateToken(userId: string, role: string): string {
    const secret = getEnv('JWT_SECRET', 'fallback-secret');
    return jwt.sign({ userId, role }, secret, { expiresIn: '24h' });
  }
}

export const authService = new AuthService();
