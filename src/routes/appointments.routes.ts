import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (req, resp) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentsList = await appointmentsRepository.find();
    return resp.json(appointmentsList);
});

appointmentsRouter.post('/', async (req, resp) => {
    const { provider_id, date } = req.body;

    const ofDate = parseISO(date);

    const createAppointments = new CreateAppointmentService();

    const appointment = await createAppointments.execute({
        provider_id,
        date: ofDate,
    });

    return resp.json(appointment);
});

export default appointmentsRouter;
