import { Core, Configuration } from 'iridium';
import { decorate, injectable, Container } from 'inversify';
/* tslint:disable */
import { interfaces as express_interfaces, TYPE } from 'inversify-express-utils';
/* tslint:enable */

import { TYPES} from './types';

import { config } from '../core/config/config';
import { Database } from '../core/database/database';
import { MailService } from './../core/mail/services/mail.service';

import { AuthService } from '../modules/user/service/authenticate.service';
import { PassportMiddleware } from './../modules/user/middleware/passport.middleware';
import { UserRepository } from './../modules/user/repository/user.repository';
import { UserService } from './../modules/user/service/user.service';
import { UserController } from './../modules/user/controller/user.controller';
import { HealthCheckController } from '../modules/healthcheck/controller/healthcheck.controller';
import { TodoController } from '../modules/todo/controller/todo.controller';
import { TodoService } from '../modules/todo/service/todo.service';
import { TodoRepository } from '../modules/todo/repository/todo.repository';

const kernel = new Container();

this.autoBindables = [UserService, TodoService];

/* Middleware */
kernel
    .bind<PassportMiddleware>(TYPES.PassportMiddleware)
    .to(PassportMiddleware);

/* Services */
kernel
    .bind(TYPES.AuthService)
    .to(AuthService);

// todo refactor all to autobindable

bindAll(kernel, this.autoBindables);

kernel
    .bind<MailService>(TYPES.MailService)
    .to(MailService);

/* Repositories */

kernel.bind<UserRepository>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();

kernel.bind(TodoRepository.name)
    .to(TodoRepository)
    .inSingletonScope();

/* Database setup */
kernel
    .bind<string>(TYPES.DatabaseUrl)
    .toConstantValue(config.mongo.uri);

if (config.mongo.user) {
    kernel
        .bind<Configuration>(TYPES.DatabaseConfig)
        .toConstantValue({
            password: config.mongo.pw,
            username: config.mongo.user,
        } as Configuration);
} else {
     kernel
        .bind<Configuration>(TYPES.DatabaseConfig)
        .toConstantValue({
            // set UserName and Password here
        } as Configuration);
}

/* Controllers */
kernel
    .bind<express_interfaces.Controller>(TYPE.Controller)
    .to(HealthCheckController)
    .whenTargetNamed('HealthCheckController');

kernel
    .bind<express_interfaces.Controller>(TYPE.Controller)
    .to(UserController)
    .whenTargetNamed('UserController');

kernel
    .bind<express_interfaces.Controller>(TYPE.Controller)
    .to(TodoController)
    .whenTargetNamed(TodoController.name);

kernel
    .bind<Database>(TYPES.Database)
    .to(Database)
    .inSingletonScope();

decorate(injectable(), Core);

function bindAll(container: any, bindables: any[]) {
    bindables.forEach(bindable => {
        bind(container, bindable);
    });
}
function bind(container: any, bindable: any) {
    container
        .bind(bindable.name)
        .to(bindable);

    return container;
}

export { kernel };

