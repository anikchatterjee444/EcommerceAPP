import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(UsersService);
    jest.clearAllMocks();
  });

  it('finds a user by email', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: '1', email: 'a@a.com' });
    const result = await service.findByEmail('a@a.com');
    expect(result?.email).toBe('a@a.com');
  });

  it('returns null when the user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const result = await service.findByEmail('missing@a.com');
    expect(result).toBeNull();
  });
});
