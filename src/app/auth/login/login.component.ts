import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../../user/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isLoading = false;
  errMessage = '';
  loginSub: Subscription;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder) { }

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

    console.log(this.loginForm);
    const email = this.email.value;
    const password = this.password.value;

    this.loginSub = this.authService
      .login$(email, password)
      .subscribe((user: User) => {
        this.isLoading = false;
        console.log(`User Logged In -> ${JSON.stringify(user)}`);
      }, (err) => {
        this.isLoading = false;
        this.errMessage = err;
        console.log(`Error Logging in: ${err}`);
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
      }]
    });
  }

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }
}
