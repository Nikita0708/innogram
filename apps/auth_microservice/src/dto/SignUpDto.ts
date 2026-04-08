export interface SignUpDto {
  email: string;
  password: string;
  username: string;
  display_name: string;
  birthday: string;
  avatar_url?: string;
  bio?: string;
}