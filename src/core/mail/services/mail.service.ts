import {injectable} from 'inversify';
import {MailGunService} from './mail.gun.service';
import {IMailService} from '../interfaces/mail.service.interface';
import {IMailFacade} from '../interfaces/mailfacade.interface';
import { config } from '../../../core/config/config';


/* tslint:disable */
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
/* tslint:enable */

@injectable()
export class MailService implements IMailService {

    private _mailFacade: IMailFacade;
    private _domain: string;
    private _activationUrl: string;
    private _resetUrl: string;
    private _companyName: string;
    private _activiationTemplateConfig: {
        path: string,
        subject: string
    };
     private _resetTemplateConfig: {
        path: string,
        subject: string
    };

    constructor() {
        this._mailFacade = new MailGunService();

        this._domain = config.common.host;
        this._activationUrl = '#/confirm';
        this._resetUrl = '#/reset';
        this._companyName = config.common.companyName;

        this._activiationTemplateConfig = {
            path: 'dist/public/mail/templates/activation.hbs',
            subject: 'Activation of Email'
        };

        this._resetTemplateConfig = {
            path: 'dist/public/mail/templates/passwordreset.hbs',
            subject: 'Reset Password'
        };
    }

    public async sendForgetPasswordMail(name: string, email: string, activationToken: string) {
        const templateData = {
            actionLink: this._domain + this._resetUrl + '?c=' + activationToken,
            companyName: this._companyName,
            name: name
        };

        const html = this._compileTemplate(this._resetTemplateConfig.path, templateData);

        return await this._mailFacade.send({
            html: html,
            subject: this._resetTemplateConfig.subject,
            to: name + '<' + email + '>'
        });
    }

    public async sendActivationMail(name: string, email: string, activationToken: string) {
        const templateData = {
            actionLink: this._domain + this._activationUrl + '?c=' + activationToken,
            companyName: this._companyName,
            name: name
        };

        const html = this._compileTemplate(this._activiationTemplateConfig.path, templateData);

        return await this._mailFacade.send({
            html: html,
        subject: this._activiationTemplateConfig.subject,
            to: name + '<' + email + '>'
        });
    }

    private _compileTemplate(templatePath: string, data: Object) {
        const templateFileName = path.join(process.cwd(), templatePath);
        const templateFile = fs.readFileSync(templateFileName, 'UTF-8');

        const templateFunc: Function = handlebars.compile(templateFile);
        return templateFunc(data);
    }
}
