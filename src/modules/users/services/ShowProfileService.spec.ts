import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUser: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUser = new FakeUsersRepository();

        showProfile = new ShowProfileService(fakeUser);
    });
    it('should be able to show the profile', async () => {
        const user = await fakeUser.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        const showUserProfile = await showProfile.execute({
            user_id: user.id,
        });

        expect(showUserProfile.id).toBe(user.id);
    });
    it('should not be able to show the profile id non-existing user', async () => {
        await expect(
            showProfile.execute({
                user_id: 'non-existing',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
