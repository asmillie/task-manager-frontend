import * as dayjs from 'dayjs';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MIN_TASK_DATE } from '../constants';

export const dateValidator: ValidatorFn =
    (control: AbstractControl): ValidationErrors | null => {
        if (control && control.value ) {
            if (!dayjs(control.value, ['MM/DD/YYYY', 'YYYY-MM-DD'], true).isValid()) {
                return { invalidDateFormat: true };
            } else if (dayjs(control.value).isBefore(MIN_TASK_DATE)) {
                return { dateBeforeMin: true };
            }
        }
        return null;
};
