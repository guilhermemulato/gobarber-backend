import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUser: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCache: FakeCacheProvider;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUser = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCache = new FakeCacheProvider();
        createUser = new CreateUserService(
            fakeUser,
            fakeHashProvider,
            fakeCache,
        );
    });

    it('should be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create two users on the same email alread', async () => {
        await createUser.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        expect(
            createUser.execute({
                name: 'John Doe',
                email: 'john@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
