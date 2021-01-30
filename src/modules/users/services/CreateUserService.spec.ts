import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUser = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUser, fakeHashProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create two users on the same email alread', async () => {
        const fakeUser = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(fakeUser, fakeHashProvider);

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
