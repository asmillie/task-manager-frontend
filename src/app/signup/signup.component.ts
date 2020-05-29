import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs';
import { User } from '../user/user';
import { EmailExistsValidator } from '../user/email-exists.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  signupForm;
  isLoading = false;
  signupSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private emailValidator: EmailExistsValidator,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.signupSub.unsubscribe();
  }

  onSubmit() {
    this.isLoading = true;

    console.log(this.signupForm);
    if (this.signupForm.status === 'INVALID') {
      this.isLoading = false;
      return;
    }

    if (this.signupForm.status === 'PENDING') {
      console.log(`Pending`);
      return;
    }

    const name = this.signupForm.get('name').value;
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;


    console.log(`Form Submitted: Email => ${email}, Password => ${password}`);
    this.signupSub = this.userService.signup$(name, email, password)
      .subscribe((user: User) => {
        this.isLoading = false;
        console.log(`User Signup Success: ${JSON.stringify(user)}`);
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

}
