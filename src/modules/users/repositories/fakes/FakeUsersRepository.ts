import IUserRepository from '@modules/users/repositories/IUserRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import IFindAllProviderDTO from '@modules/users/dtos/IFindAllProviderDTO';

class FakeUsersRepository implements IUserRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.id === id);
        return findUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.email === email);
        return findUser;
    }

    public async findAllProviders({
        expect_user_id,
    }: IFindAllProviderDTO): Promise<User[]> {
        let { users } = this;

        if (expect_user_id) {
            users = this.users.filter(user => user.id !== expect_user_id);
        }

        return users;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid() }, userData);

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const findUserIndex = this.users.findIndex(
            findIndex => findIndex.id === user.id,
        );
        this.users[findUserIndex] = user;

        return user;
    }
}

export default FakeUsersRepository;
