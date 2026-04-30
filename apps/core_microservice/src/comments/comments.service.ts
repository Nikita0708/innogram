import { CommentRepository, CommentLikeRepository, PostRepository, ProfileRepository } from '@innogram/database';
import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { NotificationsService } from '../notifications/notifications.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentLikeRepository: CommentLikeRepository,
    private readonly postRepository: PostRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createComment(profileId: string, postId: string, dto: CreateCommentDto) {
    const post = await this.postRepository.findByIdSimple(postId);
    if (!post || post.is_archived) throw new NotFoundException('Post not found');

    if (dto.parent_comment_id) {
      const parentComment = await this.commentRepository.findById(dto.parent_comment_id);
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
      const parentComment = await this.commentRepository.findById(dto.parent_comment_id);
      if (parentComment && parentComment.profile_id !== profileId) {
        await this.notificationsService.sendNotification(parentComment.profile_id, 'new_reply', 'New reply', 'Someone replied to your comment', { comment_id: comment.id, post_id: postId, profile_id: profileId });
      }
    } else if (post.profile_id !== profileId) {
      await this.notificationsService.sendNotification(post.profile_id, 'new_comment', 'New comment', 'Someone commented on your post', { comment_id: comment.id, post_id: postId, profile_id: profileId });
    }

    if (dto.mentions?.length) {
      await this.handleMentions(dto.mentions, profileId, comment.id, postId);
    }

    return comment;
  }

  async getPostComments(postId: string) {
    const post = await this.postRepository.findByIdSimple(postId);
    if (!post) throw new NotFoundException('Post not found');
    return this.commentRepository.findByPost(postId);
  }

  async getCommentReplies(commentId: string) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    return this.commentRepository.findReplies(commentId);
  }

  async updateComment(profileId: string, commentId: string, content: string) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.created_by !== profileId) throw new ForbiddenException('Not your comment');
    await this.commentRepository.update(commentId, content, profileId);
    return this.commentRepository.findByIdWithProfile(commentId);
  }

  async deleteComment(profileId: string, commentId: string) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.created_by !== profileId) throw new ForbiddenException('Not your comment');
    await this.commentRepository.delete(commentId);
    return { message: 'Comment deleted' };
  }

  async likeComment(profileId: string, commentId: string) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    const existing = await this.commentLikeRepository.findByCommentAndProfile(commentId, profileId);
    if (existing) throw new ConflictException('Already liked');
    const like = this.commentLikeRepository.create({ id: uuidv4(), comment_id: commentId, profile_id: profileId, created_by: profileId });
    await this.commentLikeRepository.save(like);
    if (comment.profile_id !== profileId) {
      await this.notificationsService.sendNotification(comment.profile_id, 'comment_liked', 'New like', 'Someone liked your comment', { comment_id: commentId, profile_id: profileId });
    }
    return like;
  }

  async unlikeComment(profileId: string, commentId: string) {
    const like = await this.commentLikeRepository.findByCommentAndProfile(commentId, profileId);
    if (!like) throw new NotFoundException('Like not found');
    await this.commentLikeRepository.delete(like.id);
    return { message: 'Unliked successfully' };
  }

  private async handleMentions(mentions: string[], authorProfileId: string, commentId: string, postId: string) {
    const profiles = await this.profileRepository.findByUsernames(mentions);
    const notifications = profiles
      .filter((p) => p.id !== authorProfileId)
      .map((p) => this.notificationsService.sendNotification(p.id, 'mention', 'You were mentioned', 'Someone mentioned you in a comment', { comment_id: commentId, post_id: postId, profile_id: authorProfileId }));
    await Promise.all(notifications);
  }
}
