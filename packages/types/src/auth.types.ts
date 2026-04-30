export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignUpRequest {
  email: string;
  password: string;
  username: string;
  display_name: string;
  birthday: string;
  bio?: string;
  avatar_url?: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse extends IAuthTokens {
  userId: string;
  email: string;
  username?: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IValidateTokenRequest {
  accessToken: string;
}

export interface IValidateTokenResponse {
  userId: string;
  role: string;
}

export interface IOAuthExchangeRequest {
  code: string;
  provider: 'google';
}
