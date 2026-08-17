import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { GithubProfile } from '../dtos/github-profile.dto';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      callbackURL: configService.get<string>('github.app.callback.url')!,
      clientID: configService.get<string>('github.app.client.id')!,
      clientSecret: configService.get<string>('github.app.client.secret')!,
      scope: ['user:email'],
    });
  }



  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GithubProfile,
  ) {
    return this.authService.validateGithubUser({
      ...profile,
      accessToken,
      refreshToken,
    });
  }
}
