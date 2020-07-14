import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { TaskQueryOptions } from '../task-query-options';
import { SORT_FIELDS, SORT_DIR, MIN_TASK_DATE } from '../../constants';
import { dateValidator } from '../../shared/date.validator';

@Component({
  selector: 'app-search-tasks',
  templateUrl: './search-tasks.component.html',
  styleUrls: ['./search-tasks.component.css']
})
export class SearchTasksComponent implements OnInit {

  searchForm: FormGroup;
  isLoading = false;
  minDate = MIN_TASK_DATE;

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
    const taskQueryOpts: TaskQueryOptions = {};
    if (this.complete.value && !this.incomplete.value) {
      taskQueryOpts.completed = true;
    } else if (!this.complete.value && this.incomplete.value) {
      taskQueryOpts.completed = false;
    }

    if (this.startCreatedAt.value !== '' && this.startCreatedAt.valid) {
      taskQueryOpts.startCreatedAt = this.startCreatedAt.value;
    }

    if (this.endCreatedAt.value !== '' && this.endCreatedAt.valid) {
      taskQueryOpts.endCreatedAt = this.endCreatedAt.value;
    }

    if (this.startUpdatedAt.value !== '' && this.startUpdatedAt.valid) {
      taskQueryOpts.startUpdatedAt = this.startUpdatedAt.value;
    }

    if (this.endUpdatedAt.value !== '' && this.endUpdatedAt.valid) {
      taskQueryOpts.endUpdatedAt = this.endUpdatedAt.value;
    }

    console.log(`Task Query: ${JSON.stringify(taskQueryOpts)}`);

  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      start_createdAt: [{
        value: '',
        disabled: this.isLoading,
      }, {
        validators: dateValidator
      }],
      end_createdAt: [{
        value: '',
        disabled: this.isLoading,
      }, {
        validators: dateValidator
      }],
      start_updatedAt: [{
        value: '',
        disabled: this.isLoading,
      }, {
        validators: dateValidator
      }],
      end_updatedAt: [{
        value: '',
        disabled: this.isLoading,
      }, {
        validators: dateValidator
      }],
      complete: [{
        value: 'true',
        disabled: this.isLoading,
      }],
      incomplete: [{
        value: 'false',
        disabled: this.isLoading
      }]
    });
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

  get complete(): AbstractControl {
    return this.searchForm.get('complete');
  }

  get incomplete(): AbstractControl {
    return this.searchForm.get('incomplete');
  }
}
