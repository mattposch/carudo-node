import * as request from 'supertest';
import {Application} from '../../../application';

describe('Healthcheck api', () => {
    let app: Application;

    before((done) => {
        app = new Application();
        app.init().then(() => {
            done();
        });
    });

    it('returns OK', (done) => {
        request(app.getExpressServer())
            .get('/api/health')
            .expect('OK', done);
    });

    after((done) => {
        app.prepareShutdown().then(() => {
            done();
        });
    });
});
