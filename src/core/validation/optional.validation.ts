import { registerDecorator,
        ValidationOptions,
         ValidatorConstraint,
         ValidatorConstraintInterface,
         ValidationArguments }
        from 'class-validator';

export function OptinalMax(property: number, validationOptions: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            constraints:    [property],
            options:        validationOptions,
            propertyName:   propertyName,
            target:         object.constructor,
            validator:      OptinalMaxConstraint
        });
    };
}

@ValidatorConstraint({ name: 'OptionalMax' })
export class OptinalMaxConstraint implements ValidatorConstraintInterface {

    public validate(value: any, args: ValidationArguments) {
         return value === null || value === '' || value === undefined || value.length <= args.constraints[0];
    }
}

export function OptinalMinMax(min: number, max: number, validationOptions: ValidationOptions) {
    return function ( object: Object, propertyName: string) {
        registerDecorator({
            constraints:    [min, max],
            options:        validationOptions,
            propertyName:   propertyName,
            target:         object.constructor,
            validator:      OptinalMinMaxConstraint
        });
    };
}

@ValidatorConstraint({ name: 'OptinalMinMax' })
export class OptinalMinMaxConstraint implements ValidatorConstraintInterface {

    public validate(value: any, args: ValidationArguments) {
         return value === null
                || value === undefined
                || value === ''
                || (value.length >= args.constraints[0] && value.length <= args.constraints[1]);
    }
}
