import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

export const passwordMatchesValidator: ValidatorFn =
    (control: FormGroup): ValidationErrors | null => {
        const password = control.get('password');
        const password2 = control.get('password2');

        let result = null;
        if (password && password2 && password.value !== password2.value) {
            result = { passwordMatches: false };
        }

        return result;
};
