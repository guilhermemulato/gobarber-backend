import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUser: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokens: FakeUserTokensRepository;

let sendForgotPassowrdEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUser = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokens = new FakeUserTokensRepository();

        sendForgotPassowrdEmail = new SendForgotPasswordEmailService(
            fakeUser,
            fakeMailProvider,
            fakeUserTokens,
        );
    });

    it('should be able to recover the password using the email', async () => {
        const generateToken = jest.spyOn(fakeUserTokens, 'generate');

        const user = await fakeUser.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await sendForgotPassowrdEmail.execute({
            email: 'johndoe@email.com',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });

    it('should not be able to recover a non-existing user passowrd', async () => {
        await expect(
            sendForgotPassowrdEmail.execute({
                email: 'johndoe@email.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const sendEmail = jest.spyOn(fakeMailProvider, 'sendEmail');

        await fakeUser.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456',
        });

        await sendForgotPassowrdEmail.execute({
            email: 'johndoe@email.com',
        });

        expect(sendEmail).toHaveBeenCalled();
    });
});
