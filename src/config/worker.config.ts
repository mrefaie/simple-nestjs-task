import { registerAs } from '@nestjs/config';

export default registerAs('worker', () => ({
  port: process.env.WORKER_PORT,
}));
