import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';

import AutheticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUser = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUser, fakeHashProvider);
        const authUser = new AutheticateUserService(fakeUser, fakeHashProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        const response = await authUser.execute({
            email: 'john@example.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        const fakeUser = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authUser = new AutheticateUserService(fakeUser, fakeHashProvider);

        expect(
            authUser.execute({
                email: 'john@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to authenticate', async () => {
        const fakeUser = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUser, fakeHashProvider);
        const authUser = new AutheticateUserService(fakeUser, fakeHashProvider);

        await createUser.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        expect(
            authUser.execute({
                email: 'john@example.com',
                password: 'non-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
