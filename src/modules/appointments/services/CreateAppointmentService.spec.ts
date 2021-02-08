import AppError from '@shared/errors/AppError';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointment: FakeAppointmentsRepository;
let fakeNotification: FakeNotificationRepository;

let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointment = new FakeAppointmentsRepository();
        fakeNotification = new FakeNotificationRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointment,
            fakeNotification,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: '123123',
            provider_id: '123456',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const appoitnmentDate = new Date(2021, 1, 10, 11);

        await createAppointment.execute({
            date: appoitnmentDate,
            user_id: '123123',
            provider_id: '123456',
        });

        await expect(
            createAppointment.execute({
                date: appoitnmentDate,
                user_id: '123123',
                provider_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 11),
                user_id: '123123',
                provider_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 13),
                user_id: '123123',
                provider_id: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to create an appointment outside before 8AM and afet 5PM', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 7),
                user_id: '123123',
                provider_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 18),
                user_id: '123123',
                provider_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
