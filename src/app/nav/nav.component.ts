import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  navbarCollapsed = true;
  isLoggedIn: boolean;
  userSub: Subscription;
  name: string;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.initAuth();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  logout(): void {
    this.authService.logout({ returnTo: window.location.origin });
  }

  private initAuth(): void {
    this.userSub = this.authService.user$.subscribe(user => {
      if (user) {
        this.name = user.name;
        return this.isLoggedIn = true;
      }

      this.isLoggedIn = false;
    });
  }

}
