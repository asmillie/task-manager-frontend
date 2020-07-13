import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { TaskSearch, TaskQueryOptions } from '../task-query-options';

@Component({
  selector: 'app-search-tasks',
  templateUrl: './search-tasks.component.html',
  styleUrls: ['./search-tasks.component.css']
})
export class SearchTasksComponent implements OnInit {

  searchForm: FormGroup;
  isLoading = false;

  constructor(
    private tasksService: TasksService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    console.log(this.searchForm);
    if (this.searchForm.status !== 'VALID') {
      return;
    }

    // TODO: Search query
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      description: [{
        value: '',
        disabled: this.isLoading,
      }],
      start_createdAt: [{
        value: '',
        disabled: this.isLoading,
      }],
      end_createdAt: [{
        value: '',
        disabled: this.isLoading,
      }],
      start_updatedAt: [{
        value: '',
        disabled: this.isLoading,
      }],
      end_updatedAt: [{
        value: '',
        disabled: this.isLoading,
      }],
      completed: [{
        value: 'all',
        disabled: this.isLoading,
      }]
    });
  }

  get description(): AbstractControl {
    return this.searchForm.get('description');
  }

  get startCreatedAt(): AbstractControl {
    return this.searchForm.get('start_createdAt');
  }

  get endCreatedAt(): AbstractControl {
    return this.searchForm.get('end_createdAt');
  }

  get startUpdatedAt(): AbstractControl {
    return this.searchForm.get('start_updatedAt');
  }

  get endUpdatedAt(): AbstractControl {
    return this.searchForm.get('end_updatedAt');
  }

  get completed(): AbstractControl {
    return this.searchForm.get('completed');
  }
}
