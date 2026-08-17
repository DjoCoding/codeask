export class RegisterGithubUserDto {
  githubId!: string;
  username!: string;
  displayName!: string;
  avatar!: string | null;
  accessToken!: string;
  refreshToken!: string;
}
