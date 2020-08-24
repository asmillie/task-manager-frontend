import { Component, OnInit, OnDestroy } from '@angular/core';
import { TasksService } from '../tasks.service';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { TaskQueryOptions } from '../task-query-options';
import { MIN_TASK_DATE } from '../../constants';
import { dateValidator } from '../../shared/date.validator';
import { Subscription } from 'rxjs';
import { TaskQueryOptionsService } from '../task-query-options.service';

@Component({
  selector: 'app-search-tasks',
  templateUrl: './search-tasks.component.html',
  styleUrls: ['./search-tasks.component.css']
})
export class SearchTasksComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;
  isLoading = false;
  minDate = MIN_TASK_DATE;
  errorMessage = '';
  searchSub: Subscription;
  tqo: TaskQueryOptions;

  constructor(
    private tqoService: TaskQueryOptionsService,
    private tasksService: TasksService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initTaskQueryOptions();
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.searchForm.status !== 'VALID') {
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const taskQueryOpts = this.getTaskQueryOpts();
    this.tqoService.taskQueryOptions.next(taskQueryOpts);

    setTimeout(() => {
      this.searchSub = this.tasksService.search$().subscribe((tasks) => {
        this.isLoading = false;
      }, (err) => {
        this.isLoading = false;
        this.errorMessage = err;
      });
    }, 3000);
    
  }

  resetForm(): void {
    this.searchForm.reset({
      complete: true,
      incomplete: true,
      start_createdAt: '',
      end_createdAt: '',
      start_updatedAt: '',
      end_updatedAt: '',
    });
  }

  private getTaskQueryOpts(): TaskQueryOptions {
    const taskQueryOpts: TaskQueryOptions = this.tqo;
    if (this.complete.value && !this.incomplete.value) {
      taskQueryOpts.completed = true;
    } else if (!this.complete.value && this.incomplete.value) {
      taskQueryOpts.completed = false;
    } else if (taskQueryOpts.completed) {
      delete taskQueryOpts.completed;
    }

    if (this.startCreatedAt.value !== '' && this.startCreatedAt.valid) {
      taskQueryOpts.startCreatedAt = new Date(this.startCreatedAt.value);
    } else if (taskQueryOpts.startCreatedAt) {
      delete taskQueryOpts.startCreatedAt;
    }

    if (this.endCreatedAt.value !== '' && this.endCreatedAt.valid) {
      const eca = new Date(this.endCreatedAt.value);
      eca.setUTCHours(23, 59, 59, 999);
      taskQueryOpts.endCreatedAt = eca;
    } else if (taskQueryOpts.endCreatedAt) {
      delete taskQueryOpts.endCreatedAt;
    }

    if (this.startUpdatedAt.value !== '' && this.startUpdatedAt.valid) {
      taskQueryOpts.startUpdatedAt = new Date(this.startUpdatedAt.value);
    } else if (taskQueryOpts.startUpdatedAt) {
      delete taskQueryOpts.startUpdatedAt;
    }

    if (this.endUpdatedAt.value !== '' && this.endUpdatedAt.valid) {
      const eua = new Date(this.endUpdatedAt.value);
      eua.setUTCHours(23, 59, 59, 999);
      taskQueryOpts.endUpdatedAt = eua;
    } else if (taskQueryOpts.endUpdatedAt) {
      delete taskQueryOpts.endUpdatedAt;
    }

    return taskQueryOpts;
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
          value: true,
          disabled: this.isLoading,
        }],
        incomplete: [{
          value: true,
          disabled: this.isLoading
        }]
     });
  }

  private initTaskQueryOptions(): void {
    const tqoSub = this.tqoService.taskQueryOptions.subscribe(tqo => {
      this.tqo = tqo;
    });

    if (this.searchSub) {
      this.searchSub.add(tqoSub);
    } else {
      this.searchSub = tqoSub;
    }
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
