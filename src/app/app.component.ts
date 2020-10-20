import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeInAnimation } from './animations';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInAnimation,
  ]
})
export class AppComponent implements OnInit {
  title = 'task-manager';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  }

  prepareOutlet(outlet: RouterOutlet) {
    if (!outlet || !outlet.isActivated) {
      return false;
    }
    return outlet && outlet.activatedRoute && outlet.activatedRoute.snapshot.url.toString();
  }
}
