import FakeApponintmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentService from './ListProviderAppointmentService';

let fakeAppointmentsRepository: FakeApponintmentsRepository;
let listProviderAppointmentService: ListProviderAppointmentService;

describe('ListProviderAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeApponintmentsRepository();

        listProviderAppointmentService = new ListProviderAppointmentService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the appointments on a specefic day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });
        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        const appointments = await listProviderAppointmentService.execute({
            provider_id: 'provider',
            day: 20,
            month: 5,
            year: 2020,
        });

        expect(appointments).toEqual([appointment1, appointment2]);
    });
});
