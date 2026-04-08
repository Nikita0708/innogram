import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { setAuthCookies } from './helpers/setAuthCookies';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signUp(@Body() dto: SignUpDto, @Res() res: Response) {
    const result = await this.authService.handleSignUp(dto);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(201).json({
      userId: result.userId,
      email: result.email,
      username: result.username,
    });
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const result = await this.authService.handleLogin(dto);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json({
      userId: result.userId,
      email: result.email,
    });
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @ApiCookieAuth('refreshToken')
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or missing refresh token' })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken: string | undefined = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is missing' });
    }

    const tokens = await this.authService.handleRefresh(refreshToken);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.status(200).json({ message: 'Token refreshed successfully' });
  }

  @Get('login/:provider')
  @ApiOperation({ summary: 'Get OAuth provider login URL' })
  @ApiResponse({ status: 200, description: 'Returns redirect URL to OAuth provider' })
  @ApiResponse({ status: 400, description: 'Unsupported provider' })
  async oauthInit(@Param('provider') provider: string, @Res() res: Response) {
    const { url } = await this.authService.handleOAuthInit(provider);
    return res.status(200).json({ url });
  }

  @Get(':provider/callback')
  @ApiOperation({ summary: 'Handle OAuth callback with authorization code' })
  @ApiResponse({ status: 200, description: 'OAuth login successful' })
  @ApiResponse({ status: 401, description: 'OAuth authentication failed' })
  async oauthCallback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    const result = await this.authService.handleOAuthCallback(provider, code);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json({ userId: result.userId, email: result.email });
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken: string | undefined = req.cookies?.refreshToken;

    try {
      if (refreshToken) {
        await this.authService.handleLogout(refreshToken);
      }
    } finally {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
    }

    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
