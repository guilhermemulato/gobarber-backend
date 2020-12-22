import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, resp) => {
    try {
        const { email, password } = req.body;

        const authenticadeUser = new AuthenticateUserService();

        const { user, token } = await authenticadeUser.execute({
            email,
            password,
        });

        delete user.password;

        return resp.json({ user, token });
    } catch (err) {
        return resp.status(400).json({ error: err.message });
    }
});

export default sessionsRouter;
