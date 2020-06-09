import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs';
import { User } from '../user/user';
import { EmailExistsValidator } from '../user/email-exists.validator';
import { passwordMatchesValidator } from '../user/password-matches.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  signupForm;
  isLoading = false;
  signupSub: Subscription;
  signupSuccess = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private emailValidator: EmailExistsValidator,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.signupSub) {
      this.signupSub.unsubscribe();
    }
  }

  onSubmit() {
    this.isLoading = true;

    if (this.signupForm.status === 'INVALID') {
      this.isLoading = false;
      return;
    }

    const name = this.signupForm.get('name').value;
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;

    this.signupSub = this.userService.signup$(name, email, password)
      .subscribe((user: User) => {
        this.isLoading = false;
        this.signupSuccess = true;
      }, (err) => {
        this.isLoading = false;
        this.signupSuccess = false;
        this.errorMessage = err;
      });
  }

  private initForm() {
    this.signupForm = this.fb.group({
      name: [
        {
          value: '',
          disabled: this.isLoading,
        },
        {
          validators: Validators.required,
        },
      ],
      email: [
        {
          value: '',
          disabled: this.isLoading,
        },
        {
          validators: [ Validators.required, Validators.email ],
          asyncValidators: this.emailValidator.validate(),
          updateOn: 'blur'
        },
      ],
      password: [
        {
          value: '',
          disabled: this.isLoading,
        },
        {
          validators: [ Validators.required, Validators.min(7) ],
        },
      ],
      password2: [
        {
          value: '',
          disabled: this.isLoading,
        },
        {
          validators: [ Validators.required, Validators.min(7) ],
        },
      ],
    }, {
      validators: passwordMatchesValidator
    });
  }

  get name() {
    return this.signupForm.get('name');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get password2() {
    return this.signupForm.get('password2');
  }

}
