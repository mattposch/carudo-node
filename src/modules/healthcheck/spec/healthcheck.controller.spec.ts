import 'reflect-metadata';
import {expect} from 'chai';

import {HealthCheckController} from '../controller/healthcheck.controller';

describe('Healthcheck controller', () => {

    let controller = new HealthCheckController();

    it('returns OK', () => {
        expect(controller.index(<any>undefined)).to.equal('OK');
    });
});
