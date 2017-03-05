import * as crypto from 'crypto';
import * as bluebird from 'bluebird';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { injectable } from 'inversify';
import { Request } from 'express';

import { config } from '../../../core/config/config';
import { LoggerFactory } from '../../../core/logging/logger.factory';

import { IJWTToken, JWTToken } from '../model/token.model';
import { IUserDBModel } from '../model/user.db.model';
import { UserMapper } from '../mapper/user.mapper';

const log = LoggerFactory.getLogger(__filename);
const randomBytes = bluebird.promisify(crypto.randomBytes);

@injectable()
export class AuthService {

    private jwtOptions: jwt.SignOptions;

    constructor(
    ) {
         this.jwtOptions = {
            expiresIn:  config.token.expiresIn
        };
    }

    /*
    *   get random String - length is configurable
    * */
    public async getRandomString(len: number) {
        return (await Promise.resolve(randomBytes(len))).toString('hex');
    }

    public async generatePasswordHash(clearPw: string): Promise<string> {
        const randomsalt: string = await this.getrandomSalt();
        const passwordHash = await this.getPasswordHash(clearPw, randomsalt);
        return passwordHash;
    }

    /*
        get random Salt for Passwords
     */
    public getrandomSalt(): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function(err, salt: string) {
                if (err) {
                    reject(err);
                } else {
                    resolve(salt);
                }
            });
        });
    }

    /*
        Create valid JWT Token for User
    */
    public signIn(user: IUserDBModel): IJWTToken {
        const mappeduser = UserMapper.mapUserToVM(user);
        let token = jwt.sign(mappeduser, config.token.security, this.jwtOptions);
        const response =  { token: token, prefix: config.token.prefix } as JWTToken;
        return response;
    }

    /*
        check cleartext Password with Hashvalue
    */
    public checkPasswords(clearPw: string, hash: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(clearPw, hash, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    /*
        helper function to extract UserInfos from JWT Token
    */
    public async extractToken(request: Request): Promise<IUserDBModel> {
        try {
            const token = await this.getTokenFromRequest(request);
            return await this.doTokenExtraction(token);
        } catch (error) {
            log.error('Decode Token Error: ', error);
            throw error;
        }
    }

    private getPasswordHash(clearPw: string, randomsalt: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(clearPw, randomsalt, function(err, hash: string) {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
    }

    private async getTokenFromRequest(request: Request) {
        const token: string = (<any>request.headers).authorization.replace(/^JWT\s/, '');
        return token;
    }

    private async doTokenExtraction(token: string) {
          try {
            const decodedtoken: any = await this.verifyToken(token);
            return decodedtoken;
        } catch (error) {
            log.error('Decode Token Error: ', error);
            throw error;
        }
    }

    private async verifyToken(token: string) {
        return new Promise((resolve: any) => {
            const secret = config.token.security;
            jwt.verify(token, secret, { ignoreExpiration: true }, (err: any, decoded: any) => {
                if (err) {
                    resolve(undefined);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}
