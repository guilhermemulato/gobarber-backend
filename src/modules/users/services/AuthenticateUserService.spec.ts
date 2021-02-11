import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';

import AutheticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUser: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authUser: AutheticateUserService;
let fakeCache: FakeCacheProvider;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUser = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCache = new FakeCacheProvider();

        createUser = new CreateUserService(
            fakeUser,
            fakeHashProvider,
            fakeCache,
        );
        authUser = new AutheticateUserService(fakeUser, fakeHashProvider);
    });

    it('should be able to authenticate', async () => {
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
        expect(
            authUser.execute({
                email: 'john@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to authenticate', async () => {
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
