import { User } from '@/user/entities/user.entity';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(@Req() req) {
    const user = req.user as User;
    const tokens = await this.authService.login(user);
    return tokens;
  }
}
