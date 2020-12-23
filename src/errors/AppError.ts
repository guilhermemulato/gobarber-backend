import { formatRFC3339WithOptions } from 'date-fns/fp';

class AppError {
    public readonly message: string;

    public readonly statuscode: number;

    constructor(message: string, statusCode = 400) {
        this.message = message;
        this.statuscode = statusCode;
    }
}

export default AppError;
