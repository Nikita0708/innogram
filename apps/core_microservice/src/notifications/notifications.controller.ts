import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/error-messages';
import { CurrentUser, CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile from JWT token' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Current user profile retrieved successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Profile not found' })
  async sendNotification(@CurrentUser() user: CurrentUserType) {
    try {
      // implement this correctly. Will be updated in the next PRs
      return await this.notificationsService.sendNotification(user.id);
    } catch (error) {
      throw error;
    }
  }
}
