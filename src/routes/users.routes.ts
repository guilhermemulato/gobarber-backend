import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, resp) => {
    const { name, email, password } = req.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
        name,
        email,
        password,
    });

    delete user.password;

    return resp.json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const { id } = request.user;
        const file = request.file.filename;
        const updateAvatarService = new UpdateUserAvatarService();

        const userAvatar = await updateAvatarService.execute({
            user_id: id,
            avatarFilename: file,
        });

        delete userAvatar.password;

        return response.json(userAvatar);
    },
);

export default usersRouter;
