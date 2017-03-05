import {
    registerDecorator, ValidationArguments, ValidatorConstraint,
    ValidatorConstraintInterface, ValidationOptions
} from 'class-validator';

export function IsEqualTo(property: string, validationOptions: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            constraints:    [property],
            options:        validationOptions,
            propertyName:   propertyName,
            target:         object.constructor,
            validator:      IsEqualToConstraint
        });
    };
}

@ValidatorConstraint({ name: 'isEqualTo' })
export class IsEqualToConstraint implements ValidatorConstraintInterface {

    public validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return  typeof value === 'string' &&
                typeof relatedValue === 'string' &&
                value === relatedValue;
    }
}
