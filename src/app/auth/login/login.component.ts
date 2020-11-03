import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isLoading = false;
  errMessage = '';
  loginSub: Subscription;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.loginForm.status !== 'VALID') {
      return;
    }

    this.isLoading = true;

    const email = this.email.value;
    const password = this.password.value;

    this.loginSub = this.authService
      .login$(email, password)
      .subscribe(_ => {
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      }, (err) => {
        this.isLoading = false;
        this.errMessage = err;
      });
  }

  onRecaptchaResolved(response: string): void {
    this.authService.verifyRecaptcha$(response)
      .pipe(take(1))
      .subscribe(res => {
        // Handle response
      });
  }

  dismissAlert(): void {
    this.errMessage = '';
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: [{
        value: '',
        disabled: this.isLoading,
      }, {
        validators: [Validators.required, Validators.email]
      }],
      password: [{
        value: '',
        disabled: this.isLoading,
      }, {
        validators: [Validators.required, Validators.minLength(7)]
      }],
      recaptcha: [null, Validators.required]
    });
  }

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }
}
