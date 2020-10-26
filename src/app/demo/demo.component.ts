import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit, OnDestroy {

  isLoading = false;
  isComplete = false;
  subscriptions: Subscription;
  errorMessage  = '';

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  onCreateDemo(): void {
    this.createDemoAccount();
  }

  private createDemoAccount(): void {
    this.errorMessage = '';
    this.isLoading = true;
    this.isComplete = false;

    this.userService.signupDemo$()
      .pipe(
        debounceTime(500),
        take(1)
      )
      .subscribe(success => {
        if (success) {
          this.isLoading = false;
          this.isComplete = true;
          setTimeout(() => {
            this.router.navigateByUrl('/tasks');
          }, 2000);
        }
      }, (err) => {
        this.isLoading = false;
        this.isComplete = false;
        this.errorMessage = err;
      });
  }

  onRetry(): void {
    this.createDemoAccount();
  }

}
