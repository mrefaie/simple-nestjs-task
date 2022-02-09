import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeormModuleMock = () => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [__dirname + '/../../../src/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
  EventEmitterModule.forRoot(),
];
