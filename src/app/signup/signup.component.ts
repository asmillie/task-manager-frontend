import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

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

    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;

    // TODO: Add Validation
    // TODO: Call authService
  }

  private initForm() {
    this.signupForm = this.fb.group({
      email: [{
        value: '',
        disabled: this.isLoading,
      }],
      password: [{
        value: '',
        disabled: this.isLoading,
      }],
    });
  }

}
