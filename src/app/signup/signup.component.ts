import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs';
import { User } from '../user/class/user';
import { EmailExistsValidator } from '../user/validator/email-exists.validator';
import { passwordMatchesValidator } from '../user/validator/password-matches.validator';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  @Output() signupCompleted = new EventEmitter<boolean>();

  signupForm;
  isLoading = false;
  signupSub: Subscription;
  errorMessage = '';
  signupSuccess = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService,
    private emailValidator: EmailExistsValidator,
    private router: Router) { }

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
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
      }, (err) => {
        this.isLoading = false;
        this.signupSuccess = false;
        this.errorMessage = err;
      });
  }

  dismissAlert(): void {
    this.errorMessage = '';
  }

  onRecaptchaResolved(response: string): void {
    this.authService.verifyRecaptcha$(response)
      .pipe(take(1))
      .subscribe(res => {
        // Handle response
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
      recaptcha: [null, Validators.required]
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
