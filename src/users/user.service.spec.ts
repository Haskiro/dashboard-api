import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUserRepository } from './user.repository.interface';
import { IUserService } from './user.service.interface';
import { TYPES } from '../types';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UserRepositoryMock: IUserRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(UserRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	userRepository = container.get<IUserRepository>(TYPES.UserRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		userRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await userService.createUser({
			email: 'a@a.ru',
			name: 'Anton',
			password: '12345',
		});

		expect(createdUser?.id).toBe(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	describe('validateUser', () => {
		it('should return true if user password is correct', async () => {
			userRepository.find = jest.fn().mockResolvedValueOnce(createdUser);
			const result = await userService.validateUser({
				email: 'a@a.ru',
				password: '12345',
			});

			expect(result).toBeTruthy();
		});

		it('should return false if user password is incorrect', async () => {
			userRepository.find = jest.fn().mockResolvedValueOnce(createdUser);
			const result = await userService.validateUser({
				email: 'a@a.ru',
				password: '123',
			});

			expect(result).toBeFalsy();
		});

		it('should return false if user does not exist', async () => {
			userRepository.find = jest.fn().mockResolvedValueOnce(null);
			const result = await userService.validateUser({
				email: 'aa@a.ru',
				password: '12345',
			});

			expect(result).toBeFalsy();
		});
	});
});
