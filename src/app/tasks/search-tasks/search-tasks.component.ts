import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-tasks',
  templateUrl: './search-tasks.component.html',
  styleUrls: ['./search-tasks.component.css']
})
export class SearchTasksComponent implements OnInit {

  searchForm: FormGroup;

  constructor(
    private tasksService: TasksService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
  }

  private initForm(): void {

  }

}
