import { Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HTTP_STATUS } from '../constants/error-messages';
import { CurrentUser, CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my notifications' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Notifications retrieved successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  async getMyNotifications(@CurrentUser() user: CurrentUserType) {
    return this.notificationsService.getMyNotifications(user.profileId);
  }

  @Patch(':notificationId/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Notification marked as read' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Notification not found' })
  async markAsRead(@Param('notificationId') notificationId: string, @CurrentUser() user: CurrentUserType) {
    return this.notificationsService.markAsRead(user.profileId, notificationId);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'All notifications marked as read' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  async markAllAsRead(@CurrentUser() user: CurrentUserType) {
    return this.notificationsService.markAllAsRead(user.profileId);
  }

  @Delete(':notificationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Notification deleted' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Notification not found' })
  async deleteNotification(@Param('notificationId') notificationId: string, @CurrentUser() user: CurrentUserType) {
    return this.notificationsService.deleteNotification(user.profileId, notificationId);
  }
}
