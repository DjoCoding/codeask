import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { GithubAccount } from './entities/github-account.entity';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GithubAccountRepository } from './repositories/github-account.repository';
import { AuthService } from './services/auth.service';
import { GithubAccountService } from './services/github-account.service';
import { GithubStrategy } from './strategies/github.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.secret'),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([GithubAccount]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GithubStrategy,
    GithubAuthGuard,
    JwtStrategy,
    JwtAuthGuard,
    GithubAccountService,
    GithubAccountRepository,
  ],
  exports: [AuthService, GithubAuthGuard, JwtAuthGuard],
})
export class AuthModule {}
