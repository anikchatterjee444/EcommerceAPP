import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a new user and never returns the password', async () => {
    const email = `test-${Date.now()}@example.com`;

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'supersecret123', name: 'Test User' })
      .expect(201);

    expect(res.body.user.email).toBe(email);
    expect(res.body.user.password).toBeUndefined();
  });

  it('rejects a duplicate email with 409', async () => {
    const email = `dup-${Date.now()}@example.com`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'supersecret123', name: 'Duplicate User' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'anotherpassword', name: 'Duplicate User' })
      .expect(409);
  });

  it('rejects a password shorter than 8 characters', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'short@example.com', password: '123', name: 'Short Password User' })
      .expect(400);
  });
});
