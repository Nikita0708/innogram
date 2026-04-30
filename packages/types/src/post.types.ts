export interface ICreatePostRequest {
  content: string;
  profile_id: string;
  asset_ids?: string[];
}

export interface IUpdatePostRequest {
  content?: string;
  asset_ids?: string[];
}
