import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { EntityManager } from 'typeorm';
import axios from 'axios';

import { AppDataSource } from '../db/data-source';
import { User } from '../entities/user.entity';
import { Account } from '../entities/account.entity';
import { Profile } from '../entities/profile.entity';
import { SignUpDto } from '../dto/SignUpDto';
import { LoginDto } from '../dto/LoginDto';

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly refreshExpiresIn: string;
  private readonly redis: Redis;

  private get userRepository() {
    return AppDataSource.getRepository(User);
  }

  private get accountRepository() {
    return AppDataSource.getRepository(Account);
  }

  private get profileRepository() {
    return AppDataSource.getRepository(Profile);
  }

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }

  async registerUser(dto: SignUpDto) {
    const { email, password, username, display_name, birthday, bio, avatar_url } = dto;

    const existingAccount = await this.accountRepository.findOne({
      where: { email },
    });
    if (existingAccount) {
      throw new ConflictError('Email already registered');
    }

    const existingProfile = await this.profileRepository.findOne({
      where: { username },
    });
    if (existingProfile) {
      throw new ConflictError('Username already taken');
    }

    const userId = uuidv4();
    const passwordHash = await this.hashPassword(password);

    await AppDataSource.transaction(async (manager: EntityManager) => {
      await manager.save(User, {
        id: userId,
        role: 'User',
        disabled: false,
        created_by: userId,
      });

      await manager.save(Account, {
        id: uuidv4(),
        user_id: userId,
        email,
        password_hash: passwordHash,
        provider: 'local',
        created_by: userId,
      });

      await manager.save(Profile, {
        id: uuidv4(),
        user_id: userId,
        username,
        display_name,
        birthday,
        bio: bio ?? null,
        avatar_url: avatar_url ?? null,
        created_by: userId,
      });
    });

    const tokens = await this.generateNewTokens(userId, 'User');
    return { ...tokens, userId, email, username };
  }

  async authenticateUser(dto: LoginDto) {
    const account = await this.accountRepository.findOne({
      where: { email: dto.email, provider: 'local' },
    });

    if (!account) {
      throw new Error('Invalid email or password');
    }

    if (!account.password_hash) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await this.comparePassword(dto.password, account.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const user = await this.userRepository.findOne({
      where: { id: account.user_id },
    });

    if (!user || user.disabled) {
      throw new Error('Account is disabled');
    }

    await this.accountRepository.update(account.id, {
      last_login_at: new Date(),
    });

    const tokens = await this.generateNewTokens(user.id, user.role);
    return { ...tokens, userId: user.id, email: account.email };
  }

  async processRefreshToken(oldRefreshTokenId: string) {
    const sessionData = await this.redis.get(`session:refresh:${oldRefreshTokenId}`);
    if (!sessionData) {
      throw new Error('Refresh token is invalid or expired');
    }

    const { userId, role } = JSON.parse(sessionData) as { userId: string; role: string };

    await this.redis.del(`session:refresh:${oldRefreshTokenId}`);

    const tokens = await this.generateNewTokens(userId, role);
    return tokens;
  }

  async validateToken(accessToken: string) {
    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(accessToken, this.jwtSecret) as jwt.JwtPayload;
    } catch {
      throw new Error('Invalid or expired access token');
    }

    const userId = payload.sub as string;
    const role = payload.role as string;

    const storedToken = await this.redis.get(`session:access:${userId}`);
    if (!storedToken || storedToken !== accessToken) {
      throw new Error('Token has been revoked or is no longer valid');
    }

    return { userId, role };
  }

  async logout(refreshTokenId: string) {
    const sessionData = await this.redis.get(`session:refresh:${refreshTokenId}`);
    if (sessionData) {
      const { userId } = JSON.parse(sessionData) as { userId: string };
      await this.redis.del(`session:access:${userId}`);
    }
    await this.redis.del(`session:refresh:${refreshTokenId}`);
  }

  private async generateNewTokens(userId: string, userRole: string) {
    const accessToken = jwt.sign(
      { sub: userId, role: userRole },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn } as jwt.SignOptions,
    );

    const refreshTokenId = uuidv4();

    const accessTTL = this.parseTTLtoSeconds(this.jwtExpiresIn);
    const refreshTTL = this.parseTTLtoSeconds(this.refreshExpiresIn);

    await this.redis.set(`session:access:${userId}`, accessToken, 'EX', accessTTL);
    await this.redis.set(
      `session:refresh:${refreshTokenId}`,
      JSON.stringify({ userId, role: userRole }),
      'EX',
      refreshTTL,
    );

    return { accessToken, refreshToken: refreshTokenId };
  }

  buildGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async handleGoogleOAuth(code: string) {
    const tokenRes = await axios.post<{
      access_token: string;
      id_token: string;
    }>('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenRes.data;

    const userInfoRes = await axios.get<{
      sub: string;
      email: string;
      name: string;
      picture: string;
    }>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { sub: googleId, email, name, picture } = userInfoRes.data;

    const existingGoogleAccount = await this.accountRepository.findOne({
      where: { provider: 'google', provider_id: googleId },
    });

    if (existingGoogleAccount) {
      const user = await this.userRepository.findOne({
        where: { id: existingGoogleAccount.user_id },
      });
      if (!user || user.disabled) throw new Error('Account is disabled');
      await this.accountRepository.update(existingGoogleAccount.id, { last_login_at: new Date() });
      const tokens = await this.generateNewTokens(user.id, user.role);
      return { ...tokens, userId: user.id, email };
    }

    const existingLocalAccount = await this.accountRepository.findOne({
      where: { email },
    });

    if (existingLocalAccount) {
      await this.accountRepository.save({
        id: uuidv4(),
        user_id: existingLocalAccount.user_id,
        email,
        password_hash: null,
        provider: 'google',
        provider_id: googleId,
        last_login_at: new Date(),
        created_by: existingLocalAccount.user_id,
      });
      const user = await this.userRepository.findOne({
        where: { id: existingLocalAccount.user_id },
      });
      if (!user || user.disabled) throw new Error('Account is disabled');
      const tokens = await this.generateNewTokens(user.id, user.role);
      return { ...tokens, userId: user.id, email };
    }

    const userId = uuidv4();
    const username = await this.generateUniqueUsername();

    await AppDataSource.transaction(async (manager: EntityManager) => {
      await manager.save(User, {
        id: userId,
        role: 'User',
        disabled: false,
        created_by: userId,
      });

      await manager.save(Account, {
        id: uuidv4(),
        user_id: userId,
        email,
        password_hash: null,
        provider: 'google',
        provider_id: googleId,
        last_login_at: new Date(),
        created_by: userId,
      });

      await manager.save(Profile, {
        id: uuidv4(),
        user_id: userId,
        username,
        display_name: name,
        birthday: new Date('2000-01-01'),
        bio: null,
        avatar_url: picture ?? null,
        created_by: userId,
      });
    });

    const tokens = await this.generateNewTokens(userId, 'User');
    return { ...tokens, userId, email, username };
  }

  private async generateUniqueUsername(): Promise<string> {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username: string;
    let exists = true;

    do {
      const suffix = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      username = `user_${suffix}`;
      const existing = await this.profileRepository.findOne({ where: { username } });
      exists = !!existing;
    } while (exists);

    return username;
  }

  async exchangeCodeForTokens(code: string, provider: string) {
    throw new Error('Method not implemented.');
  }

  private parseTTLtoSeconds(ttl: string): number {
    const unit = ttl.slice(-1);
    const value = parseInt(ttl.slice(0, -1), 10);
    if (unit === 'm') return value * 60;
    if (unit === 'h') return value * 3600;
    if (unit === 'd') return value * 86400;
    return parseInt(ttl, 10);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
