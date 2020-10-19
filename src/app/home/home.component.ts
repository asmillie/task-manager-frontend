import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginMode = true;

  constructor() { }

  ngOnInit(): void {}

  toggleMode(): void {
    this.loginMode = !this.loginMode;
  }

  onSignupCompleted(): void {
    this.toggleMode();
  }

}
