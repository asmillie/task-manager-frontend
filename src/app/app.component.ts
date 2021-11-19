import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeInAnimation } from './animations';

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

  constructor() {}

  ngOnInit(): void {
  }

  prepareOutlet(outlet: RouterOutlet) {
    if (!outlet || !outlet.isActivated) {
      return false;
    }
    return outlet && outlet.activatedRoute && outlet.activatedRoute.snapshot.url.toString();
  }
}
