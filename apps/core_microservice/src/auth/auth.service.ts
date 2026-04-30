import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';

import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { CoreConfigService } from '../common/config/core-config.service';

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;

  constructor(private readonly config: CoreConfigService) {
    this.authServiceUrl = this.config.authServiceUrl;
  }

  async handleSignUp(dto: SignUpDto) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/internal/auth/register`, dto);
      return response.data as { accessToken: string; refreshToken: string; userId: string; email: string; username: string };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        throw new ConflictException(error.response.data?.error);
      }
      throw new InternalServerErrorException('Auth service unavailable');
    }
  }

  async handleLogin(dto: LoginDto) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/internal/auth/login`, dto);
      return response.data as { accessToken: string; refreshToken: string; userId: string; email: string };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new UnauthorizedException(error.response.data?.error || 'Invalid credentials');
      }
      throw new InternalServerErrorException('Auth service unavailable');
    }
  }

  async handleRefresh(refreshToken: string) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/internal/auth/refresh`, { refreshToken });
      return response.data as { accessToken: string; refreshToken: string };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new UnauthorizedException(error.response.data?.error || 'Invalid refresh token');
      }
      throw new InternalServerErrorException('Auth service unavailable');
    }
  }

  async handleOAuthInit(provider: string): Promise<{ url: string }> {
    try {
      const response = await axios.get(`${this.authServiceUrl}/internal/auth/oauth/initiate`, {
        params: { provider },
      });
      return response.data as { url: string };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        throw new BadRequestException(error.response.data?.error || 'Unsupported provider');
      }
      throw new InternalServerErrorException('Auth service unavailable');
    }
  }

  async handleOAuthCallback(provider: string, code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    userId: string;
    email: string;
  }> {
    try {
      const response = await axios.post(`${this.authServiceUrl}/internal/auth/oauth/exchange-code`, {
        code,
        provider,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new UnauthorizedException(error.response.data?.error || 'OAuth authentication failed');
      }
      if (error instanceof AxiosError && error.response?.status === 400) {
        throw new BadRequestException(error.response.data?.error || 'Invalid OAuth request');
      }
      throw new InternalServerErrorException('Auth service unavailable');
    }
  }

  async handleLogout(refreshToken: string) {
    try {
      await axios.post(`${this.authServiceUrl}/internal/auth/logout`, { refreshToken });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new UnauthorizedException(error.response.data?.error || 'Invalid token');
      }
      throw new InternalServerErrorException('Auth service unavailable');
    }
  }

  async validateToken(accessToken: string) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/internal/auth/validate`, { accessToken });
      return response.data as { userId: string; role: string };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new UnauthorizedException('Invalid or expired access token');
      }
      throw new InternalServerErrorException('Auth service unavailable');
    }
  }
}
