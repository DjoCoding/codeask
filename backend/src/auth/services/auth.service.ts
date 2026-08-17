import { User } from '@/user/entities/user.entity';
import { UserService } from '@/user/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { JwtPayload } from '../dtos/jwt-payload.dto';
import { RegisterGithubUserDto } from '../dtos/register-user.github.dto';
import { ValidateGithubUserDto } from '../dtos/validate-github-profile.dto';
import { GithubAccountService } from './github-account.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly githubAccountService: GithubAccountService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByGithubId(id: string) {
    const account = await this.githubAccountService.findByGithubId(id);
    return account?.user ?? null;
  }

  async validateGithubUser(dto: ValidateGithubUserDto) {
    const { id, username, displayName, photos, accessToken, refreshToken } =
      dto;

    const user = await this.findUserByGithubId(id);
    if (user !== null) return user;

    const newUser = await this.registerGithubUser({
      githubId: id,
      username,
      displayName,
      accessToken,
      refreshToken,
      avatar: photos?.[0]?.value || null,
    });
    return newUser;
  }

  private async registerGithubUser(
    registerGithubUserDto: RegisterGithubUserDto,
  ) {
    const {
      username,
      accessToken,
      avatar,
      displayName,
      githubId,
      refreshToken,
    } = registerGithubUserDto;

    const user = await this.dataSource.transaction(async (manager) => {
      const user = await this.userService.create(
        {
          displayName,
          avatar,
        },
        manager,
      );

      const _ = await this.githubAccountService.create(
        {
          githubId,
          username,
          accessToken,
          refreshToken,
          userId: user.id,
        },
        manager,
      );

      return user;
    });

    return user;
  }

  async validateJwtUser(jwtPayload: JwtPayload) {
    const { sub } = jwtPayload;

    const user = await this.userService.findById(sub);
    if (user === null) {
      throw new UnauthorizedException('invalid user');
    }

    return user;
  }

  async login(user: User) {
    const now = Date.now();

    const accessTokenPayload: JwtPayload = {
      iss: 'http://codeask.com',
      sub: user.id,
      iat: now,
      exp: new Date(now + 60 * 60 * 1000).getTime(),
      jti: randomUUID(),
    };

    const refreshTokenPayload: JwtPayload = {
      iss: 'http://codeask.com',
      sub: user.id,
      iat: now,
      exp: new Date(now + 7 * 24 * 60 * 60 * 1000).getTime(),
      jti: randomUUID(),
    };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload);
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
