import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';

export default class UserAvatarController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.user;
        const file = request.file.filename;

        const updateAvatarService = container.resolve(UpdateUserAvatarService);

        const userAvatar = await updateAvatarService.execute({
            user_id: id,
            avatarFilename: file,
        });

        return response.json(classToClass(userAvatar));
    }
}
