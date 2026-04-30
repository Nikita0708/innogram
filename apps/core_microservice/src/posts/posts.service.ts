import { PostRepository, PostAssetRepository, PostLikeRepository } from '@innogram/database';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postAssetRepository: PostAssetRepository,
    private readonly postLikeRepository: PostLikeRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getPostById(postId: string) {
    const post = await this.postRepository.findById(postId);
    if (!post || post.is_archived) throw new NotFoundException('Post not found');
    const assets = post.post_assets.sort((a, b) => a.order_index - b.order_index).map((pa) => pa.asset);
    return { ...post, assets, post_assets: undefined };
  }

  async getPostsByProfileId(profileId: string, page: number = 1, limit: number = 10) {
    const posts = await this.postRepository.findByProfileId(profileId);
    const sorted = posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const paginated = sorted.slice((page - 1) * limit, page * limit);
    return paginated.map((post) => {
      const firstAsset = post.post_assets.sort((a, b) => a.order_index - b.order_index)[0]?.asset ?? null;
      return { ...post, preview_asset: firstAsset, post_assets: undefined };
    });
  }

  async createPost(userId: string, dto: CreatePostDto) {
    const { asset_ids, ...postData } = dto;
    const newPost = this.postRepository.create({ id: uuidv4(), ...postData, created_by: userId });
    await this.postRepository.save(newPost);
    if (asset_ids?.length) {
      const postAssets = asset_ids.map((assetId, index) =>
        this.postAssetRepository.create({ id: uuidv4(), post_id: newPost.id, asset_id: assetId, order_index: index, created_by: userId }),
      );
      await this.postAssetRepository.saveMany(postAssets);
    }
    return newPost;
  }

  async updatePost(userId: string, postId: string, dto: UpdatePostDto) {
    const { asset_ids, ...postData } = dto;
    const post = await this.postRepository.findByIdSimple(postId);
    if (!post) throw new NotFoundException('The post was not found');
    if (post.created_by !== userId) throw new ForbiddenException('You are not author of this post');
    if (post.is_archived) throw new ForbiddenException('This post is archived.');
    await this.postRepository.update(post.id, { ...postData, updated_by: userId });
    if (asset_ids !== undefined) {
      await this.postAssetRepository.deleteByPostId(postId);
      if (asset_ids.length > 0) {
        const postAssets = asset_ids.map((assetId, index) =>
          this.postAssetRepository.create({ id: uuidv4(), post_id: postId, asset_id: assetId, order_index: index, created_by: userId }),
        );
        await this.postAssetRepository.saveMany(postAssets);
      }
    }
    return this.postRepository.findById(postId);
  }

  async toggleArchivePost(userId: string, postId: string) {
    const post = await this.postRepository.findByIdSimple(postId);
    if (!post) throw new NotFoundException('Post not found');
    if (post.created_by !== userId) throw new ForbiddenException('You are not author of this post');
    await this.postRepository.update(post.id, { is_archived: !post.is_archived });
    return this.postRepository.findByIdSimple(post.id);
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.postRepository.findByIdSimple(postId);
    if (!post) throw new NotFoundException('Post not found');
    if (post.created_by !== userId) throw new ForbiddenException('You are not author of this post');
    await this.postRepository.delete(post.id);
    return { message: 'Post was deleted successfully' };
  }

  async searchPosts(query: string, page: number = 1, limit: number = 10) {
    if (!query?.trim()) throw new BadRequestException('Search query is required');
    const { data, total } = await this.postRepository.search(query, page, limit);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async likePost(profileId: string, postId: string) {
    const post = await this.postRepository.findByIdSimple(postId);
    if (!post || post.is_archived) throw new NotFoundException('Post not found');
    const existing = await this.postLikeRepository.findByPostAndProfile(postId, profileId);
    if (existing) throw new ConflictException('Already liked');
    const like = this.postLikeRepository.create({ id: uuidv4(), post_id: postId, profile_id: profileId, created_by: profileId });
    await this.postLikeRepository.save(like);
    if (post.profile_id !== profileId) {
      await this.notificationsService.sendNotification(post.profile_id, 'post_liked', 'New like', 'Someone liked your post', { post_id: postId, profile_id: profileId });
    }
    return like;
  }

  async unlikePost(profileId: string, postId: string) {
    const like = await this.postLikeRepository.findByPostAndProfile(postId, profileId);
    if (!like) throw new NotFoundException('Like not found');
    await this.postLikeRepository.delete(like.id);
    return { message: 'Unliked successfully' };
  }
}
