import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './user';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  userSub: Subscription;
  user: User;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initUser();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  private initUser(): void {
    this.userSub = this.route.data.subscribe(
      (data: { user: User }) => {
        this.user = data.user;
      });
  }
}
