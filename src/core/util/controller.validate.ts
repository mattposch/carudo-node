import { Request } from 'express';
import { Deserialize } from 'cerialize';
import { validate, Validator } from 'class-validator';
import { ValidationException } from '../validation/error/validation.exception';
import { IBaseRequest } from '../base/base.request';

export interface IErrorValidationMessage {
    column: string;
    message: string;
}

export function doValidate<T>(toValidate: any): Promise<T> {
     return validate(toValidate, { skipmissingproperties: true })
        .then((errors) => {
            if (errors.length > 0) {
                /* tslint:disable */
                if (errors[0].constraints['isEqualTo']) {
                    throw new ValidationException(`${errors[0].constraints['isEqualTo']}`);
                } else if (errors[0].constraints['matches']) {
                    throw new ValidationException(`${errors[0].constraints['matches']}`);
                } else if (errors[0].constraints['isWalletAddress']) {
                    throw new ValidationException(`Field ${errors[0].property}: ${errors[0].constraints['isWalletAddress']}`);
                } else if (errors[0].constraints['OptionalMax']) {
                    throw new ValidationException(`Field ${errors[0].property}: ${errors[0].constraints['OptionalMax']}`);
                } else if (errors[0].constraints['OptinalMinMax']) {
                    throw new ValidationException(`Field ${errors[0].property}: ${errors[0].constraints['OptinalMinMax']}`);
                } else if (errors[0].constraints['MinLength']) {
                    throw new ValidationException(`Field ${errors[0].property}: ${errors[0].constraints['MinLength']}`);
                } else if (errors[0].constraints['MaxLength']) {
                    throw new ValidationException(`Field ${errors[0].property}: ${errors[0].constraints['MaxLength']}`);
                } else if (errors[0].constraints['IsNotEmpty']) {
                    throw new ValidationException(`Field ${errors[0].property}: ${errors[0].constraints['IsNotEmpty']}`);
                } else if (errors[0].constraints['IsEmail']) {
                    throw new ValidationException(`Field ${errors[0].property}: ${errors[0].constraints['IsEmail']}`);
                } else if (errors[0].constraints['IsNumber']) {
                    throw new ValidationException(`Field ${errors[0].property}: ${errors[0].constraints['IsNumber']}`);
                } else {
                    throw new ValidationException(`There was a Validationerror with Field ${errors[0].property}`);
                }
                /* tslint:enable */

            } else {
                return <T>toValidate;
            }
        });
}

/**
 * Validates a request body based on the given object validation annotations.
 * @param request   Request
 * @param target    Object which contains the validation annotation
 * @returns {Promise<Tstring>}
 */
export function validateBody<T>(request: Request, target: IBaseRequest): Promise<T> {
    const toValidate = Deserialize(request.body, target);
    return doValidate<T>(toValidate);
}

export function validateNotRest<T>(model: any, target: IBaseRequest): Promise<T> {
     const toValidate = Deserialize(model, target);
     return doValidate<T>(toValidate);
}

/**
 * Validates a MongoDB ID.
 * @param id MongoDB ID
 * @returns {string} the id for chaining
 */
export function validateId(id: string) {
    const validator = new Validator();
    if (!validator.isMongoId(id)) {
        throw new ValidationException(`ID '${id}' failed validation.`);
    }
    return id;
}
