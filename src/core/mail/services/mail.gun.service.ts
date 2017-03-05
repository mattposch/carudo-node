import { IRawMailDataModel, IMailResponse } from '../interfaces/mail.service.interface';
import { injectable } from 'inversify';
import { config } from '../../../core/config/config';

/* tslint:disable */
const mailgun = require('mailgun-js')({apiKey: config.mail.apikey, domain: config.mail.domain});
/* tslint:enable */

import {IMailFacade} from '../interfaces/mailfacade.interface';

@injectable()
export class MailGunService implements IMailFacade {

    private _from: string;

    constructor() {
        this._from = config.mail.sender;
    }

    public send(mailData: IRawMailDataModel): Promise<IMailResponse> {
        return new Promise<IMailResponse>((resolve, reject) => {
            mailgun.messages().send(
                {
                    from: this._from,
                    html: mailData.html,
                    subject: mailData.subject,
                    to: mailData.to
                },
                function (error: Error, body: IMailResponse) {
                    if (!error) {
                        resolve(body);
                    } else {
                        reject(error);
                    }
                }
            );
        });
    }
}
