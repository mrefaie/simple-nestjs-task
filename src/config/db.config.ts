import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  applicationName: process.env.APP_NAME,
  autoLoadEntities: true,
  synchronize: false,
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [join(__dirname, '../**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'migrations/**', '*.{ts,js}')],
  seeds: [join(__dirname, '..', 'seeds/**/*{.ts,.js}')],
  cli: {
    migrationsDir: 'src/migrations',
  },
}));
