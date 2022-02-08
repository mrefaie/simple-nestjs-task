import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dbConfig from './config/db.config';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { JobsController } from './jobs/jobs.controller';
import { JobsModule } from './jobs/jobs.module';
import { CaslModule } from './casl/casl.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig, appConfig, authConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get<string>('database.type'),
          host: configService.get<string>('database.host'),
          port: Number(configService.get<string>('database.port')),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          keepConnectionAlive: true,
          logging: configService.get<string>('app.env') === 'development',
        } as TypeOrmModuleOptions),
    }),
    AuthModule,
    UsersModule,
    JobsModule,
    CaslModule,
  ],
  controllers: [AppController, AuthController, UsersController, JobsController],
  providers: [AppService],
})
export class AppModule {}
