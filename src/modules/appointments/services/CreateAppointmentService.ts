import 'reflect-metadata';
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationRepository')
        private notificationRepository: INotificationRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        provider_id,
        user_id,
        date,
    }: IRequest): Promise<Appointment> {
        const startDate = startOfHour(date);

        if (getHours(startDate) < 8 || getHours(startDate) > 17) {
            throw new AppError(
                "You can't create appointment between 8AM and 5PM",
            );
        }

        if (isBefore(startDate, Date.now())) {
            throw new AppError("You can't create an appointment on past date");
        }

        if (provider_id === user_id) {
            throw new AppError("You can't create an appointment with yourself");
        }

        const findAppointmentSameDate = await this.appointmentsRepository.findByDate(
            startDate,
        );

        if (findAppointmentSameDate) {
            throw new AppError('This appointment is already booked');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: startDate,
        });

        const dateFormatted = format(startDate, "dd/MM/yyyy 'às' HH:mm'h'");

        await this.notificationRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${dateFormatted}`,
        });

        await this.cacheProvider.invalidate(
            `provider-appointments:${provider_id}:${format(
                startDate,
                'yyyy-M-d',
            )}`,
        );

        return appointment;
    }
}
export default CreateAppointmentService;
