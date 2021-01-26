import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (req, resp) => {
//     const appointmentsList = await appointmentsRepository.find();
//     return resp.json(appointmentsList);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
