import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HTTP_STATUS } from '../constants/error-messages';
import { CurrentUser, CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ProfilesService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Get('current_profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current profile from JWT token' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Current user retrieved successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'User not found' })
  async getCurrentProfile(@CurrentUser() user: CurrentUserType) {
    return await this.profilesService.getCurrentProfile(user.id);
  }

  @Patch('current_profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current profile from JWT token' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Profile updated successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'User not found' })
  async updateProfile(@CurrentUser() user: CurrentUserType, @Body() dto: UpdateProfileDto) {
    return await this.profilesService.updateProfile(user.id, dto);
  }

  @Delete('current_profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete current profile (soft delete, 30 days to recover)' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Profile deleted successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'User not found' })
  async deleteProfile(@CurrentUser() user: CurrentUserType) {
    return await this.profilesService.deleteProfile(user.id);
  }
}
