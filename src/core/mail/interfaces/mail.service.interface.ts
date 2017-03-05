export interface IMailService {
    sendActivationMail(name: string, email: string, activationToken: string): void;
}

export interface IRawMailDataModel {
    to:         string;
    subject:    string;
    html:       string;
}

export interface IMailResponse {
    id:         string;
    message:    string;
}
