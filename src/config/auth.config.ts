import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.JWT_SIGN_SECRET,
  expiry: parseInt(process.env.JWT_EXPIRY_IN_SECONDS, 10),
}));
