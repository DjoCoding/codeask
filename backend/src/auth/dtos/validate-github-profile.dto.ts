import { GithubProfile } from './github-profile.dto';

export class ValidateGithubUserDto extends GithubProfile {
  accessToken!: string;
  refreshToken!: string;
}
