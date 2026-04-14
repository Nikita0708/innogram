import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from '@/database/entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostAsset } from '@/database/entities/post-asset.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(PostAsset)
    private readonly postAssetRepository: Repository<PostAsset>
  ) { }

  async getPostById(postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['post_assets', 'post_assets.asset']
    })

    if (!post || post.is_archived) {
      throw new NotFoundException('Post not found')
    }

    const assets = post.post_assets
      .sort((a, b) => a.order_index - b.order_index)
      .map(pa => pa.asset)

    return { ...post, assets, post_assets: undefined };
  }

  async getPostsByProfileId(profileId: string, page: number = 1, limit: number = 10) {
    const posts = await this.postRepository.find({
      where: { profile_id: profileId, is_archived: false },
      relations: ['post_assets', 'post_assets.asset'],
    })

    const sorted = posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const paginated = sorted.slice((page - 1) * limit, page * limit)

    return paginated.map(post => {
      const firstAsset = post.post_assets.sort((a, b) => a.order_index - b.order_index)[0]?.asset ?? null

      return { ...post, preview_asset: firstAsset, post_assets: undefined }
    })
  }

  async createPost(userId: string, dto: CreatePostDto) {
    const { asset_ids, ...postData } = dto;
    const newPost = this.postRepository.create({ id: uuidv4(), ...postData, created_by: userId })

    await this.postRepository.save(newPost)

    if (asset_ids?.length) {
      const postAssets = asset_ids.map((assetId, index) =>
        this.postAssetRepository.create({
          id: uuidv4(),
          post_id: newPost.id,
          asset_id: assetId,
          order_index: index,
          created_by: userId,
        })
      )
      await this.postAssetRepository.save(postAssets)
    }
    return newPost;
  }

  async updatePost(userId: string, postId: string, dto: UpdatePostDto) {
    const { asset_ids, ...postData } = dto;

    const post = await this.postRepository.findOne({
      where: { id: postId }
    })

    if (!post) throw new NotFoundException("The post was not found")
    if (post.created_by !== userId) throw new ForbiddenException('You are not author of this post')
    if (post.is_archived) throw new ForbiddenException("This post is archived.")

    await this.postRepository.update(post.id, {
      ...postData,
      updated_by: userId,
    });

    if (asset_ids !== undefined) {
      await this.postAssetRepository.delete({ post_id: postId })

      if (asset_ids.length > 0) {
        const postAssets = asset_ids.map((assetId, index) =>
          this.postAssetRepository.create({
            id: uuidv4(),
            post_id: postId,
            asset_id: assetId,
            order_index: index,
            created_by: userId,
          })
        )
        await this.postAssetRepository.save(postAssets)
      }
    }

    return this.postRepository.findOne({
      where: { id: postId },
      relations: ['post_assets', 'post_assets.asset']
    });
  }

  async toggleArchivePost(userId: string, postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId }
    })

    if (post.created_by !== userId) {
      throw new ForbiddenException("You are not author of this post")
    }

    if (post.is_archived) {
      await this.postRepository.update(post.id, { is_archived: false })
    }

    await this.postRepository.update(post.id, { is_archived: true })

    return this.postRepository.findOne({ where: { id: post.id } })
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } })

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    if (post.created_by !== userId) {
      throw new ForbiddenException('You are not author of this post')
    }

    await this.postRepository.delete(post.id)

    return { message: 'Post was deleted successfully' }
  }

  async searchPosts(query: string, page: number = 1, limit: number = 10) {
    if (!query?.trim()) throw new BadRequestException('Search query is required');

    const [posts, total] = await this.postRepository.createQueryBuilder('post')
      .where('post.content ILIKE :query', { query: `%${query}%` })
      .andWhere('post.is_archived = false')
      .orderBy('post.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()


    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
}
