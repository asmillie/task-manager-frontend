import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { fadeInAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInAnimation,
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Task Manager';
  errorSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.initErrorObs();
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  prepareOutlet(outlet: RouterOutlet) {
    if (!outlet || !outlet.isActivated) {
      return false;
    }
    return outlet && outlet.activatedRoute && outlet.activatedRoute.snapshot.url.toString();
  }

  private initErrorObs() {
    this.errorSub = this.authService.error$.pipe(
      filter((e) => e && e.message && e.message.toLowerCase() === 'login required'),
      mergeMap(() => this.authService.getAccessTokenSilently())
    ).subscribe();
  }
}
