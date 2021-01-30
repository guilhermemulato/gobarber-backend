import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('UpdateUserAvatar', () => {
    it('should be able to update avatar a user', async () => {
        const fakeUser = new FakeUsersRepository();
        const fakeStorage = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUser,
            fakeStorage,
        );

        const user = await fakeUser.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar from non existing user', async () => {
        const fakeUser = new FakeUsersRepository();
        const fakeStorage = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUser,
            fakeStorage,
        );

        expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFilename: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar on new one', async () => {
        const fakeUser = new FakeUsersRepository();
        const fakeStorage = new FakeStorageProvider();

        const deleteFile = jest.spyOn(fakeStorage, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUser,
            fakeStorage,
        );

        const user = await fakeUser.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        });
        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });
});
