import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './class/user';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, Form } from '@angular/forms';
import { passwordMatchesValidator } from './validator/password-matches.validator';
import { UserUpdateOpts } from './class/user-update-opts';
import { UserService } from './user.service';
import { debounce, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EmailExistsValidator } from './validator/email-exists.validator';

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
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private emailValidator: EmailExistsValidator,
    private router: Router) { }

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
    this.isLoading = true;

    if (this.userForm.status !== 'VALID' || !this.userForm.dirty) {
      this.isLoading = false;
      return;
    }

    const userUpdateOpts = this.getUserUpdateOpts();
    if (!userUpdateOpts) {
      return;
    }

    const userUpdate = this.userService.update$(userUpdateOpts, this.user.token).subscribe({
      next: () => { this.isLoading = false; },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err;
      },
    });

    this.userSub.add(userUpdate);
  }

  private initUser(): void {
    this.userSub = this.route.data.subscribe(
      (data: { user: User }) => {
        if (!data.user) {
          this.router.createUrlTree(['/']);
        }
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
        validators: [Validators.required, Validators.email],
        asyncValidators: this.emailValidator.validate(),
        updateOn: 'blur',
      }],
      password: [{
          value: '',
          disabled: this.isLoading,
      }, {
        validators: Validators.min(7)
      }],
      password2: [{
          value: '',
          disabled: this.isLoading,
      }, {
        validators: Validators.min(7)
      }],
    }, {
      validators: passwordMatchesValidator
    });
  }

  private getUserUpdateOpts(): UserUpdateOpts | null {
    const name = (this.name.dirty && this.name.valid) ? this.name.value : undefined;
    const email = (this.email.dirty && this.email.valid) ? this.email.value : undefined;
    const password = (
      this.password.dirty &&
      this.password.valid &&
      this.password.value === this.password2.value) ? this.password.value : undefined;

    const updateOpts: UserUpdateOpts = {};
    if (name) {
      updateOpts.name = name;
    }

    if (email) {
      updateOpts.email = {
        address: email
      };
    }

    if (password) {
      updateOpts.password = password;
    }

    if (Object.keys(updateOpts).length === 0) {
      return null;
    }

    return updateOpts;
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
