import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import dbConfig from './config/db.config';
import authConfig from './config/auth.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { CaslModule } from './casl/casl.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import queueConfig from './config/queue.config';
import { BullModule } from '@nestjs/bull';
import { EmailNotificationProcessor } from './notifications/email.notification.processor';
import workerConfig from './config/worker.config';
import { MailerModule } from '@nestjs-modules/mailer';
import mailConfig from './config/mail.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig, authConfig, queueConfig, workerConfig, mailConfig],
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('queue'),
      }),
    }),
    BullModule.registerQueue({
      name: 'EmailNotification',
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mail.host'),
          port: configService.get<string>('mail.port'),
          auth: {
            user: configService.get<string>('mail.user'),
            pass: configService.get<string>('mail.password'),
          },
          tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false,
          },
          logger: configService.get<string>('app.env') === 'development',
          debug: configService.get<string>('app.env') === 'development',
        },
        defaults: {
          from: `"${configService.get<string>(
            'mail.fromName',
          )}" <${configService.get<string>('mail.fromEmail')}>`,
        },
      }),
    }),
    AuthModule,
    UsersModule,
    JobsModule,
    CaslModule,
  ],
  controllers: [],
  providers: [EmailNotificationProcessor],
})
export class WorkerModule {}
