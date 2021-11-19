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
  isLoading: Boolean;
  isLoggedIn: Boolean;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoggedIn = false;
    this.initUserSub();    
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  public login(): void {
    this.isLoading = true;
    this.authService.loginWithRedirect();
  }

  private initUserSub() {
    this.userSub = this.authService.user$.subscribe(user => {
      this.isLoading = false;
      if (user && user.email) {
        this.isLoggedIn = true;
        // User is Authenticated, redirect to tasks
        return this.router.navigateByUrl('/tasks');
      }

      this.isLoggedIn = false;
    });
  }

}
