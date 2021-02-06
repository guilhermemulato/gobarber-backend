import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUser: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUser = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(fakeUser, fakeHashProvider);
    });
    it('should be able to update the profile', async () => {
        const user = await fakeUser.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        const updateUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
        });

        expect(updateUser.name).toBe('John Tre');
        expect(updateUser.email).toBe('johntre@example.com');
    });
    it('should not be able change email to other email in use', async () => {
        await fakeUser.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        const user = await fakeUser.create({
            name: 'test',
            email: 'test@example.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Doe',
                email: 'john@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to update the profile id non-existing user', async () => {
        await expect(
            updateProfile.execute({
                user_id: 'non-existing',
                name: 'Test',
                email: 'test@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUser.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        const updateUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updateUser.password).toBe('123123');
    });
    it('should not be able to update the password without old password', async () => {
        const user = await fakeUser.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Tre',
                email: 'johntre@example.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUser.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Tre',
                email: 'johntre@example.com',
                old_password: '123654',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
