import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() alertMessage: string;
  @Output() dismissEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  dismiss() {
    this.dismissEvent.emit();
  }

}
