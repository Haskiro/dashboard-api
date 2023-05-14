import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	describe('register', () => {
		it('should send error if user exists', async () => {
			const res = await request(application.app).post('/users/register').send({
				email: 'a@a.ru',
				name: 'Anton',
				password: '12345',
			});

			expect(res.statusCode).toBe(422);
		});
	});

	describe('login', () => {
		it('should send ok status and jwt if user credentials are correct', async () => {
			const res = await request(application.app).post('/users/login').send({
				email: 'a@a.ru',
				password: '12345',
			});

			expect(res.statusCode).toBe(200);
			expect(res.body.jwt).toBeDefined();
		});

		it('should send error if user credentials are incorrect', async () => {
			const res = await request(application.app).post('/users/login').send({
				email: 'a@a.ru',
				password: '123',
			});

			expect(res.statusCode).toBe(401);
			expect(res.body.error).toBeDefined();
			expect(res.body.error).toBe('Ошибка авторизации');
		});
	});

	describe('info', () => {
		it('should send data if jwt is correct', async () => {
			const { body } = await request(application.app).post('/users/login').send({
				email: 'a@a.ru',
				password: '12345',
			});
			const token = body.jwt;

			const res = await request(application.app)
				.get('/users/info')
				.set('Authorization', `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
			expect(res.body.email).toBeDefined();
			expect(res.body.email).toBe('a@a.ru');
			expect(res.body.id).toBeDefined();
		});

		it('should error if jwt is incorrect or absent', async () => {
			const res = await request(application.app)
				.get('/users/info')
				.set('Authorization', `Bearer 123`);

			expect(res.statusCode).toBe(401);
			expect(res.body.error).toBeDefined();
			expect(res.body.error).toBe('Вы не авторизованы');
		});
	});
});

afterAll(() => {
	application.close();
});
