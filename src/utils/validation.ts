namespace App {
    export interface Validatable {
        value: string | number
        required?: boolean
        minLength?: number
        maxLength?: number
        min?: number
        max?: number
    }

    export function validate(validatableInput: Validatable) {
        let valid = true
        if (validatableInput.required) {
            valid = valid && validatableInput.value.toString().trim().length !== 0
        }

        if (validatableInput.minLength != null &&
            typeof validatableInput.value === 'string') {
            valid = valid && validatableInput.value.length > validatableInput.minLength
        }

        if (validatableInput.maxLength != null &&
            typeof validatableInput.value === 'string') {
            valid = valid && validatableInput.value.length < validatableInput.maxLength
        }

        if (validatableInput.min != null && typeof validatableInput.value === 'number') {
            valid = valid && validatableInput.value > validatableInput.min
        }

        if (validatableInput.max != null && typeof validatableInput.value === 'number') {
            valid = valid && validatableInput.value < validatableInput.max
        }

        return valid
    }
}