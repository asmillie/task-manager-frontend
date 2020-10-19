import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { TaskQueryOptions } from '../task-query-options';
import { MIN_TASK_DATE } from '../../constants';
import { dateValidator } from '../../shared/date.validator';
import { Subscription } from 'rxjs';
import { TaskRepositoryService } from '../task-repository.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-search-tasks',
  templateUrl: './search-tasks.component.html',
  styleUrls: ['./search-tasks.component.scss']
})
export class SearchTasksComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;
  isLoading = false;
  minDate = MIN_TASK_DATE;
  errorMessage = '';
  searchSub: Subscription;
  tqo: TaskQueryOptions;

  constructor(
    private taskRepo: TaskRepositoryService,
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
    this.taskRepo.setQueryOption(taskQueryOpts);

    this.searchSub = this.taskRepo.search$().subscribe((tasks) => {
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      this.errorMessage = err;
    });
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
    } else if (taskQueryOpts.completed !== undefined) {
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
    const sca = (this.tqo.startCreatedAt) ? this.getFormattedDateString(this.tqo.startCreatedAt) : '';
    const eca = (this.tqo.endCreatedAt) ? this.getFormattedDateString(this.tqo.endCreatedAt) : '';
    const sua = (this.tqo.startUpdatedAt) ? this.getFormattedDateString(this.tqo.startUpdatedAt) : '';
    const eua = (this.tqo.endUpdatedAt) ? this.getFormattedDateString(this.tqo.endUpdatedAt) : '';

    this.searchForm = this.fb.group({
        start_createdAt: [{
          value: sca,
          disabled: this.isLoading,
        }, {
          validators: dateValidator
        }],
        end_createdAt: [{
          value: eca,
          disabled: this.isLoading,
        }, {
          validators: dateValidator
        }],
        start_updatedAt: [{
          value: sua,
          disabled: this.isLoading,
        }, {
          validators: dateValidator
        }],
        end_updatedAt: [{
          value: eua,
          disabled: this.isLoading,
        }, {
          validators: dateValidator
        }],
        complete: [{
          value: (this.tqo.completed !== undefined) ? this.tqo.completed : true,
          disabled: this.isLoading,
        }],
        incomplete: [{
          value: (this.tqo.completed !== undefined) ? !this.tqo.completed : true,
          disabled: this.isLoading
        }]
     });
  }

  private initTaskQueryOptions(): void {
    const tqoSub = this.taskRepo.taskQueryOptions$.subscribe(tqo => {
      this.tqo = tqo;
    });

    if (this.searchSub) {
      this.searchSub.add(tqoSub);
    } else {
      this.searchSub = tqoSub;
    }
  }

  private getFormattedDateString(date: Date): string | null {
    if (!date) {
      return;
    }
    const d = dayjs(date);
    return d.format('YYYY-MM-DD');
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
