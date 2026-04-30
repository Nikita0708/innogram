import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HTTP_STATUS } from '@innogram/shared';
import { CurrentUser, CurrentUser as CurrentUserType } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Comment created successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Post not found' })
  async createComment(
    @Param('postId') postId: string,
    @CurrentUser() user: CurrentUserType,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(user.profileId, postId, dto);
  }

  @Get(':postId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Comments retrieved successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Post not found' })
  async getPostComments(@Param('postId') postId: string) {
    return this.commentsService.getPostComments(postId);
  }

  @Get(':commentId/replies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get replies to a comment' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Replies retrieved successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Comment not found' })
  async getCommentReplies(@Param('commentId') commentId: string) {
    return this.commentsService.getCommentReplies(commentId);
  }

  @Patch(':commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit a comment' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Comment updated successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Comment not found' })
  async updateComment(
    @Param('commentId') commentId: string,
    @CurrentUser() user: CurrentUserType,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(user.profileId, commentId, dto.content);
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Comment deleted successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Comment not found' })
  async deleteComment(
    @Param('commentId') commentId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.commentsService.deleteComment(user.profileId, commentId);
  }

  @Post(':commentId/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like a comment' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Comment liked successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Comment not found' })
  async likeComment(@Param('commentId') commentId: string, @CurrentUser() user: CurrentUserType) {
    return this.commentsService.likeComment(user.profileId, commentId);
  }

  @Delete(':commentId/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unlike a comment' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Comment unliked successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Like not found' })
  async unlikeComment(
    @Param('commentId') commentId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.commentsService.unlikeComment(user.profileId, commentId);
  }
}
