import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderService from './ListProviderService';

let fakeUser: FakeUsersRepository;
let listProvider: ListProviderService;
let fakeCache: FakeCacheProvider;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUser = new FakeUsersRepository();
        fakeCache = new FakeCacheProvider();
        listProvider = new ListProviderService(fakeUser, fakeCache);
    });
    it('should be able to list the providers', async () => {
        const user1 = await fakeUser.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        });

        const user2 = await fakeUser.create({
            name: 'John Tre',
            email: 'johntre@example.com',
            password: '123456',
        });

        const loggerdUser = await fakeUser.create({
            name: 'John Que',
            email: 'johnqua@example.com',
            password: '123456',
        });

        const providers = await listProvider.execute({
            user_id: loggerdUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
