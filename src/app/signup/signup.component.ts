import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs';
import { User } from '../user/user';

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

    const name = this.signupForm.get('name').value;
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;

    // TODO: Add Validation
    console.log(`Form Submitted: Email => ${email}, Password => ${password}`);
    this.signupSub = this.userService.signup(name, email, password)
      .subscribe((user: User) => {
        this.isLoading = false;
        console.log(`User Signup Success: ${JSON.stringify(user)}`);
      });
  }
  // TODO: Async Validation of Unique Email Address
  private initForm() {
    this.signupForm = this.fb.group({
      name: [{
        value: '',
        disabled: this.isLoading,
        },
        [ Validators.required ],
      ],
      email: [{
          value: '',
          disabled: this.isLoading,
        },
        [ Validators.required, Validators.email ],
      ],
      password: [{
          value: '',
          disabled: this.isLoading,
        },
        [ Validators.required ],
      ],
    });
  }

}
