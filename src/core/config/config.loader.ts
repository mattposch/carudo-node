import * as dotenv from 'dotenv';
import {Validator} from 'class-validator';

/**
 * Load .env file and checks if all mandatory environment variables are available.
 * @param mandatoryEnvEntries Array of mandatory environment variables
 */
export function loadEnv(mandatoryEnvEntries: string[]): void {
    dotenv.config({silent: true});
    // enforceMandatoryEntries(mandatoryEnvEntries);
}

/**
 * Checks if all mandatory environment variables are available.
 * @param mandatoryEnvEntries Array of mandatory environment variables
 */
// function enforceMandatoryEntries(mandatoryEnvEntries: string[]): void {
//     let isError = false;
//     mandatoryEnvEntries.forEach((name: string) => {
//         if (!process.env[name]) {
//             console.error(`Environment variable ${name} is missing`);
//             isError = true;
//         }
//     });
//
//     if (isError) {
//         process.exit(1);
//     }
// }

/**
 * Validation entry.
 */
interface IValidiationEntry {
    /** The name of the environment variable */
    name: string;

    /** The validation callback */
    valCb: (validator: Validator, value: string) => boolean;
}

/**
 * Performs the validation.
 * @param validationEntries Array of validation entries
 */
export function validate(validationEntries: IValidiationEntry[]): void {
    const validator = new Validator();
    validationEntries.forEach((entry: IValidiationEntry) => {
        const value = process.env[entry.name];
        if (value != null) {
            const result = entry.valCb(validator, value);
            if (!result) {
                console.error(`Environment variable ${entry.name} has an invalid value: ${value}`);
                process.exit(1);
            }
        }
    });
}
