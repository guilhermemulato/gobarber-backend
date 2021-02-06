import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        user_id,
        name,
        email,
        password,
        old_password,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('Users non-existing');
        }

        const userWithupdatedEmail = await this.usersRepository.findByEmail(
            email,
        );

        if (userWithupdatedEmail && userWithupdatedEmail.id !== user_id) {
            throw new AppError('Email in use');
        }

        user.name = name;
        user.email = email;

        if (password && !old_password) {
            throw new AppError('Old password is missing');
        }

        if (password && old_password) {
            const passwordCompare = await this.hashProvider.compareHash(
                old_password,
                user.password,
            );

            if (!passwordCompare) {
                throw new AppError('Old password does not match');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
