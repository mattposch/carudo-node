import { injectable } from 'inversify';

export interface IJWTToken {
    token: string;
    prefix: string;
}

@injectable()
export class JWTToken implements IJWTToken {
    public token: string;
    public prefix: string;
}
