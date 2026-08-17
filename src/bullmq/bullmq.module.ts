import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          connection: {
            host: configService.get<string>('redis.host'),
            port: configService.get<number>('redis.port'),
            password: configService.get<number>('redis.password'),
          },
        };
      },
    }),
  ],
  exports: [BullModule],
})
export class BullmqModule {}
