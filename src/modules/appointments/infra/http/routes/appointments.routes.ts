import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/me', providerAppointmentsController.index);
appointmentsRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required(),
            date: Joi.required(),
        },
    }),
    appointmentsController.create,
);

export default appointmentsRouter;
