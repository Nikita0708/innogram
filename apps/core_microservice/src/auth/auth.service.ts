import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

import { ERROR_MESSAGES } from '../constants/error-messages';

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.authServiceUrl = this.configService.get('AUTH_SERVICE_URL', 'http://localhost:3002');
  }

  async handleSignUp(signUpDto: object) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/internal/auth/register`, signUpDto);
      return response.data as { accessToken: string; refreshToken: string; userId: string; email: string; username: string };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        throw new ConflictException(error.response.data?.error);
      }
      throw new InternalServerErrorException('Auth service unavailable');
    }
  }

  async handleLogin(credentials: object) {
    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  }

  async handleOAuthInit(provider: string) {
    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  }

  async handleOAuthCallback(provider: string, authorizationCode: string) {
    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  }

  async handleRefresh(refreshTokenId: string) {
    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  }

  async handleLogout(refreshTokenId: string) {
    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  }

  async validateToken(accessToken: string) {
    const response = await axios.post(`${this.authServiceUrl}/internal/auth/validate`, { accessToken });
    return response.data as { userId: string; role: string };
  }
}
