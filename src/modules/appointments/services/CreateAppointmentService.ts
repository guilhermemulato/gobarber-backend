import 'reflect-metadata';
import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        date,
    }: IRequest): Promise<Appointment> {
        const startDate = startOfHour(date);

        const findAppointmentSameDate = await this.appointmentsRepository.findByDate(
            startDate,
        );

        if (findAppointmentSameDate) {
            throw new AppError('This appointment is already booked');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: startDate,
        });

        return appointment;
    }
}
export default CreateAppointmentService;
