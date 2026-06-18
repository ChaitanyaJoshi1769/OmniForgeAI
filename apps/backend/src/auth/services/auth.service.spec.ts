import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { AuthProvider } from '../../common/enums/auth-provider.enum';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key, defaultValue) => defaultValue),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const createdUser: User = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        passwordHash: 'hashedPassword',
        emailVerified: false,
        isActive: true,
        authProviders: [AuthProvider.EMAIL],
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        get fullName() {
          return 'John Doe';
        },
      } as User;

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockResolvedValue(createdUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        const config = {
          JWT_SECRET: 'secret',
          JWT_REFRESH_SECRET: 'refresh-secret',
          JWT_EXPIRES_IN: '15m',
          JWT_REFRESH_EXPIRES_IN: '7d',
        };
        return config[key] || null;
      });

      const result = await service.register(registerInput);

      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(userRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const existingUser = { id: '123', email: 'john@example.com' } as User;
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(existingUser);

      await expect(service.register(registerInput)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login a user with valid credentials', async () => {
      const loginInput = {
        email: 'john@example.com',
        password: 'password123',
      };

      const user: User = {
        id: '123',
        email: 'john@example.com',
        passwordHash: '$2b$10$hashedPassword',
        isActive: true,
        lastLoginAt: null,
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        authProviders: [AuthProvider.EMAIL],
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        get fullName() {
          return 'John Doe';
        },
      } as User;

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(userRepository, 'update').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await service.login(loginInput);

      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const loginInput = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      await expect(service.login(loginInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const user: User = {
        id: '123',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        get fullName() {
          return 'John Doe';
        },
      } as User;

      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token');
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        const config = {
          JWT_SECRET: 'secret',
          JWT_REFRESH_SECRET: 'refresh-secret',
          JWT_EXPIRES_IN: '15m',
          JWT_REFRESH_EXPIRES_IN: '7d',
        };
        return config[key] || null;
      });

      const tokens = service.generateTokens(user);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.tokenType).toBe('Bearer');
      expect(tokens.expiresIn).toBe(900);
    });
  });
});
