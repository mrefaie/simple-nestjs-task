import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormModuleMock } from '../../test/unit/bootstrap/typeorm.module.mock';
import { User, UserRole } from '../entities/User.entity';
import { AuthService } from './auth.service';
import { UsersRepository } from './../users/users.repository';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

describe('AuthController', () => {
  let moduleRef: TestingModule;
  let authService;
  let jwtService: JwtService;

  let testManagerUser = new User({
    email: 'admin@example.com',
    password: '123456',
    role: UserRole.MANAGER,
  });

  const authConfig = {
    secret: 'ABC',
    expiry: 10,
  };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [registerAs('auth', () => authConfig)],
          isGlobal: true,
        }),
        ...TypeormModuleMock(),
        TypeOrmModule.forFeature([UsersRepository]),
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('auth.secret'),
            signOptions: {
              expiresIn: configService.get<number>('auth.expiry'),
            },
          }),
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }).compile();

    const usersRepository = await moduleRef.resolve(UsersRepository);

    const user = await usersRepository.create(testManagerUser);
    await usersRepository.save(user);
    delete user.password;
    testManagerUser = new User({ ...testManagerUser, ...user });

    authService = await moduleRef.resolve(AuthService);
    jwtService = await moduleRef.resolve(JwtService);
  });

  describe('validateUser', () => {
    it('should return a valid user for valid credentials', async () => {
      const r = await authService.validateUser(
        testManagerUser.email,
        testManagerUser.password,
      );
      expect(r).toBeInstanceOf(User);
      expect({ email: r.email, role: r.role }).toEqual({
        email: testManagerUser.email,
        role: testManagerUser.role,
      });
    });

    it('should return null for invalid credentials', async () => {
      const r = await authService.validateUser(
        testManagerUser.email,
        testManagerUser.password + 1,
      );
      expect(r).toBe(null);
    });
  });

  describe('login', () => {
    it('should return a valid jwt access token', async () => {
      const r = await authService.login(testManagerUser);
      expect(r).toHaveProperty('access_token');

      const decoded = jwtService.decode(r.access_token) as {
        [key: string]: any;
      };

      expect(decoded.sub).toBe(testManagerUser.id);
      expect(decoded.email).toBe(testManagerUser.email);
      expect(decoded.password).toBe(undefined);
    });
  });

  afterEach(async () => {
    moduleRef.close();
  });
});
