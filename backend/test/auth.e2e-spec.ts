/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

interface RegisterResponse {
  user: {
    email: string;
    password?: string;
  };
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a new user and never returns the password', async () => {
    const email = `test-${Date.now()}@example.com`;

    const res = await request(server)
      .post('/auth/register')
      .send({ email, password: 'supersecret123', name: 'Test User' })
      .expect(201);

    const body = res.body as RegisterResponse;
    expect(body.user.email).toBe(email);
    expect(body.user.password).toBeUndefined();
  });

  it('rejects a duplicate email with 409', async () => {
    const email = `dup-${Date.now()}@example.com`;

    await request(server)
      .post('/auth/register')
      .send({ email, password: 'supersecret123' })
      .expect(201);

    await request(server)
      .post('/auth/register')
      .send({ email, password: 'anotherpassword' })
      .expect(409);
  });

  it('rejects a password shorter than 8 characters', async () => {
    await request(server)
      .post('/auth/register')
      .send({ email: 'short@example.com', password: '123' })
      .expect(400);
  });
});
