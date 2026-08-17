import { GithubAccount } from '@/auth/entities/github-account.entity';
import { Ingestion } from '@/ingestion/entities/ingestion.entity';
import { Repository } from '@/repository/entities/repository.entity';
import { User } from '@/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          port: configService.get<number>('db.port'),
          name: configService.get<string>('db.name'),
          username: configService.get<string>('db.user'),
          password: configService.get<string>('db.password'),
          entities: [User, GithubAccount, Ingestion, Repository],
          synchronize: true,
          logging: 'all',
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
