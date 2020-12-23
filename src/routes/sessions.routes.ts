import { Router } from 'express';
import AppError from '../errors/AppError';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, resp) => {
    const { email, password } = req.body;

    const authenticadeUser = new AuthenticateUserService();

    const { user, token } = await authenticadeUser.execute({
        email,
        password,
    });

    delete user.password;

    return resp.json({ user, token });
});

export default sessionsRouter;
