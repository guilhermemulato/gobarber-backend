import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointment: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointment = new FakeAppointmentsRepository();
        createAppointment = new CreateAppointmentService(fakeAppointment);
    });

    it('should be able to create a new appointment', async () => {
        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '123456',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const appoitnmentDate = new Date(2021, 1, 10, 11);

        await createAppointment.execute({
            date: appoitnmentDate,
            provider_id: '123456',
        });

        expect(
            createAppointment.execute({
                date: appoitnmentDate,
                provider_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
