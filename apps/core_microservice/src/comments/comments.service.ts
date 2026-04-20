import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Comment } from '@/database/entities/comment.entity';
import { CommentLike } from '@/database/entities/comment-like.entity';
import { Post } from '@/database/entities/post.entity';
import { Profile } from '@/database/entities/profile.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    private readonly notificationsService: NotificationsService,
  ) {}

  async createComment(profileId: string, postId: string, dto: CreateCommentDto) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post || post.is_archived) throw new NotFoundException('Post not found');

    if (dto.parent_comment_id) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: dto.parent_comment_id },
      });
      if (!parentComment) throw new NotFoundException('Parent comment not found');
    }

    const comment = this.commentRepository.create({
      id: uuidv4(),
      post_id: postId,
      profile_id: profileId,
      parent_comment_id: dto.parent_comment_id ?? null,
      content: dto.content,
      created_by: profileId,
    });

    await this.commentRepository.save(comment);

    if (dto.parent_comment_id) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: dto.parent_comment_id },
      });
      if (parentComment && parentComment.profile_id !== profileId) {
        await this.notificationsService.sendNotification(
          parentComment.profile_id,
          'new_reply',
          'New reply',
          'Someone replied to your comment',
          { comment_id: comment.id, post_id: postId, profile_id: profileId },
        );
      }
    } else if (post.profile_id !== profileId) {
      await this.notificationsService.sendNotification(
        post.profile_id,
        'new_comment',
        'New comment',
        'Someone commented on your post',
        { comment_id: comment.id, post_id: postId, profile_id: profileId },
      );
    }

    if (dto.mentions?.length) {
      await this.handleMentions(dto.mentions, profileId, comment.id, postId);
    }

    return comment;
  }

  async getPostComments(postId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    return this.commentRepository.find({
      where: { post_id: postId, parent_comment_id: null },
      order: { created_at: 'DESC' },
      relations: ['profile'],
    });
  }

  async getCommentReplies(commentId: string) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    return this.commentRepository.find({
      where: { parent_comment_id: commentId },
      order: { created_at: 'ASC' },
      relations: ['profile'],
    });
  }

  async updateComment(profileId: string, commentId: string, content: string) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.created_by !== profileId) throw new ForbiddenException('Not your comment');

    await this.commentRepository.update(commentId, { content, updated_by: profileId });

    return this.commentRepository.findOne({ where: { id: commentId }, relations: ['profile'] });
  }

  async deleteComment(profileId: string, commentId: string) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.created_by !== profileId) throw new ForbiddenException('Not your comment');

    await this.commentRepository.delete(commentId);

    return { message: 'Comment deleted' };
  }

  async likeComment(profileId: string, commentId: string) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    const existing = await this.commentLikeRepository.findOne({
      where: { comment_id: commentId, profile_id: profileId },
    });
    if (existing) throw new ConflictException('Already liked');

    const like = this.commentLikeRepository.create({
      id: uuidv4(),
      comment_id: commentId,
      profile_id: profileId,
      created_by: profileId,
    });

    await this.commentLikeRepository.save(like);

    if (comment.profile_id !== profileId) {
      await this.notificationsService.sendNotification(
        comment.profile_id,
        'comment_liked',
        'New like',
        'Someone liked your comment',
        { comment_id: commentId, profile_id: profileId },
      );
    }

    return like;
  }

  async unlikeComment(profileId: string, commentId: string) {
    const like = await this.commentLikeRepository.findOne({
      where: { comment_id: commentId, profile_id: profileId },
    });

    if (!like) throw new NotFoundException('Like not found');

    await this.commentLikeRepository.delete(like.id);

    return { message: 'Unliked successfully' };
  }

  private async handleMentions(
    mentions: string[],
    authorProfileId: string,
    commentId: string,
    postId: string,
  ) {
    const profiles = await this.profileRepository
      .createQueryBuilder('profile')
      .where('profile.username IN (:...usernames)', { usernames: mentions })
      .andWhere('profile.deleted = false')
      .getMany();

    const notifications = profiles
      .filter((p) => p.id !== authorProfileId)
      .map((p) =>
        this.notificationsService.sendNotification(
          p.id,
          'mention',
          'You were mentioned',
          'Someone mentioned you in a comment',
          { comment_id: commentId, post_id: postId, profile_id: authorProfileId },
        ),
      );

    await Promise.all(notifications);
  }
}
