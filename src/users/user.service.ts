import { injectable } from 'inversify';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import 'reflect-metadata';

@injectable()
export class UserService implements IUserService {
	async createUser({ email, password, name }: UserRegisterDTO): Promise<User | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password);
		// проверка, что он есть?
		// если есть - возращаем null
		// если нет - создаем
		return newUser;
	}

	async validateUser({ email, password }: UserLoginDTO): Promise<boolean> {
		return Promise.resolve(true);
	}
}
