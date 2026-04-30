import { ProfileRepository } from '@innogram/database';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly profileRepository: ProfileRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'];

    let accessToken: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      accessToken = authHeader.slice(7);
    } else if (request.cookies?.accessToken) {
      accessToken = request.cookies.accessToken;
    }

    if (!accessToken) {
      throw new UnauthorizedException('Missing or invalid access token');
    }

    const userData = await this.authService.validateToken(accessToken);
    const profile = await this.profileRepository.findByUserId(userData.userId);

    request.user = {
      id: userData.userId,
      role: userData.role,
      profileId: profile?.id ?? null,
    };

    return true;
  }
}
