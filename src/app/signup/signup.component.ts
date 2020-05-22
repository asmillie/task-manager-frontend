import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
    this.isLoading = true;

    console.log(this.signupForm);
    if (this.signupForm.status === 'INVALID') {
      this.isLoading = false;
      return;
    }

    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;

    // TODO: Add Validation
    // TODO: Call authService
    console.log(`Form Submitted: Email => ${email}, Password => ${password}`);
  }
  // TODO: Async Validation of Unique Email Address
  private initForm() {
    this.signupForm = this.fb.group({
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
