import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  // TODO: Redirect logged-in users to /tasks
  userSub: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initUserSub();    
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  private initUserSub() {
    this.userSub = this.authService.user$.subscribe(user => {
      if (user && user.email) {
        // User is Authenticated, redirect to tasks
        this.router.createUrlTree(['/tasks']);
      }
    })
  }

}
