import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './class/user';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { passwordMatchesValidator } from './validator/password-matches.validator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  userSub: Subscription;
  user: User;
  userForm: FormGroup;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initUser();
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  onSubmit(): void {
    console.log(this.userForm);
  }

  private initUser(): void {
    this.userSub = this.route.data.subscribe(
      (data: { user: User }) => {
        this.user = data.user;
      });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      name: [{
        value: this.user.name,
        disabled: this.isLoading,
      }, {
          validators: [Validators.required]
      }],
      email: [{
        value: this.user.email,
        disabled: this.isLoading,
      }, {
        validators: [Validators.required, Validators.email]
      }],
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

  get name(): AbstractControl {
    return this.userForm.get('name');
  }

  get email(): AbstractControl {
    return this.userForm.get('email');
  }

  get password(): AbstractControl {
    return this.userForm.get('password');
  }

  get password2(): AbstractControl {
    return this.userForm.get('password2');
  }
}
