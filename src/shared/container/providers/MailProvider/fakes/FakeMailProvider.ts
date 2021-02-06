import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

class FakeMailProvider implements IMailProvider {
    private messages: ISendMailDTO[] = [];

    public async sendEmail(message: ISendMailDTO): Promise<void> {
        this.messages.push(message);
    }
}

export default FakeMailProvider;
