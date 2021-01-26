import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

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

        // delete userAvatar.password;

        return response.json(userAvatar);
    }
}
