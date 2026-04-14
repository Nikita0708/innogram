import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/error-messages';
import { CurrentUser, CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get('post/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get post by id' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Post retrieved successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Post not found' })
  async getPost(@Param('id') postId: string) {
    return await this.postsService.getPostById(postId)
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search posts by content' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Posts were found successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  async searchPosts(
    @Query('query') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postsService.searchPosts(query, page, limit)
  }

  @Get(':profileId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get posts by profile Id' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Posts were fetched successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  async getPostsByProfileId(
    @Param('profileId') profileId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postsService.getPostsByProfileId(profileId, page, limit)
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Post' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Post was created successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  async createPost(@CurrentUser() user: CurrentUserType, @Body() dto: CreatePostDto) {
    return await this.postsService.createPost(user.id, dto);
  }

  @Patch(':postId/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Post' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Post was updated successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  async updatePost(@Param('postId') postId: string, @CurrentUser() user: CurrentUserType, @Body() dto: UpdatePostDto) {
    return await this.postsService.updatePost(user.id, postId, dto);
  }

  @Patch(':postId/toggle-archive')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle Archive Post' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Post was archived/unarchived successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  async toggleArchivePost(@Param('postId') postId: string, @CurrentUser() user: CurrentUserType) {
    return await this.postsService.toggleArchivePost(user.id, postId);
  }

  @Delete(':postId/delete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Post' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Post was updated successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  async deletePost(@Param('postId') postId: string, @CurrentUser() user: CurrentUserType) {
    return await this.postsService.deletePost(user.id, postId);
  }

}
