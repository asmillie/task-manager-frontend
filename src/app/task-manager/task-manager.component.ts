import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeInAnimation } from '../animations';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss'],
  animations: [
    fadeInAnimation,
  ]
})
export class TaskManagerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  prepareTaskOutlet(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
