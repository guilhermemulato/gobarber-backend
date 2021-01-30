import AppError from '@shared/errors/AppError';
import ResetPasswordService from './ResetPasswordService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUser: FakeUsersRepository;
let fakeUserTokens: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;

let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUser = new FakeUsersRepository();
        fakeUserTokens = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUser,
            fakeUserTokens,
            fakeHashProvider,
        );
    });

    it('should be able to reset password', async () => {
        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        const user = await fakeUser.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        const { token } = await fakeUserTokens.generate(user.id);

        await resetPassword.execute({
            password: '123123',
            token,
        });

        const updateUser = await fakeUser.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updateUser?.password).toBe('123123');
    });

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokens.generate('non-existing-ser');

        await expect(
            resetPassword.execute({
                token,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password if passed more the 2 hours', async () => {
        const user = await fakeUser.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        const { token } = await fakeUserTokens.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPassword.execute({
                password: '123123',
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
