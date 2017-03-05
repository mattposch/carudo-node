import {expect} from 'chai';

import {validateId} from '../util/controller.validate';
import { ValidationException } from '../validation/error/validation.exception';

describe('Controller validation utils', () => {
    it('validates an invalid ID', () => {
        expect(() => {
            validateId('1');
        }).to.throw(ValidationException, "ID '1' failed validation.");
    });

    it('validates a valid ID', () => {
        const id: string = '581a1745571e150010ae2872';
        expect(validateId(id)).to.equal(id);
    });
});
