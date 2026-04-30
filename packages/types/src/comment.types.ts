export interface ICreateCommentRequest {
  content: string;
  parent_comment_id?: string;
  mentions?: string[];
}

export interface IUpdateCommentRequest {
  content: string;
}
