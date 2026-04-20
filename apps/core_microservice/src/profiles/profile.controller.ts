import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HTTP_STATUS } from '../constants/error-messages';
import { CurrentUser, CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ProfilesService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('current_profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current profile from JWT token' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Current user retrieved successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Profile not found' })
  async getCurrentProfile(@CurrentUser() user: CurrentUserType) {
    return this.profilesService.getCurrentProfile(user.id);
  }

  @Patch('current_profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current profile' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Profile updated successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Profile not found' })
  async updateProfile(@CurrentUser() user: CurrentUserType, @Body() dto: UpdateProfileDto) {
    return this.profilesService.updateProfile(user.id, dto);
  }

  @Delete('current_profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete current profile (soft delete, 30 days to recover)' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Profile deleted successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Profile not found' })
  async deleteProfile(@CurrentUser() user: CurrentUserType) {
    return this.profilesService.deleteProfile(user.id);
  }

  @Get('follow-requests/pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending follow requests' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Pending requests retrieved successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  async getPendingRequests(@CurrentUser() user: CurrentUserType) {
    return this.profilesService.getPendingRequests(user.profileId);
  }

  @Patch('follow-requests/:followerProfileId/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a follow request' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Follow request accepted' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Follow request not found' })
  async acceptFollowRequest(
    @Param('followerProfileId') followerProfileId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.profilesService.acceptFollowRequest(user.profileId, followerProfileId);
  }

  @Delete('follow-requests/:followerProfileId/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a follow request' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Follow request rejected' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Follow request not found' })
  async rejectFollowRequest(
    @Param('followerProfileId') followerProfileId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.profilesService.rejectFollowRequest(user.profileId, followerProfileId);
  }

  @Post(':profileId/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a profile' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Profile followed successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Profile not found' })
  async followProfile(
    @Param('profileId') profileId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.profilesService.followProfile(user.profileId, profileId);
  }

  @Delete(':profileId/unfollow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a profile' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Profile unfollowed successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Follow not found' })
  async unfollowProfile(
    @Param('profileId') profileId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.profilesService.unfollowProfile(user.profileId, profileId);
  }

  @Get(':profileId/followers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get followers list' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Followers fetched successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  async getFollowers(@Param('profileId') profileId: string) {
    return this.profilesService.getFollowers(profileId);
  }

  @Get(':profileId/following')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get following list' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Following fetched successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  async getFollowing(@Param('profileId') profileId: string) {
    return this.profilesService.getFollowing(profileId);
  }
}
