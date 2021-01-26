import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { provider_id, date } = request.body;

        const ofDate = parseISO(date);
        const createAppointments = container.resolve(CreateAppointmentService);

        const appointment = await createAppointments.execute({
            provider_id,
            date: ofDate,
        });

        return response.json(appointment);
    }
}