import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Task } from '../task';
import { User } from '../../user/class/user';
import { TaskRepositoryService } from '../task-repository.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {

  private ADD_MODE = 'ADD';
  private EDIT_MODE = 'EDIT';

  mode = this.ADD_MODE;
  user: User;
  addTaskForm: FormGroup;
  isLoading: boolean;
  subscriptions: Subscription;
  errorMessage = '';
  task: Task;

  constructor(
    private activatedRoute: ActivatedRoute,
    private taskRepo: TaskRepositoryService,
    private router: Router,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initTask();
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.addTaskForm.status !== 'VALID') {
      this.isLoading = false;
      return;
    }

    const task = new Task(this.description.value, this.completed.value);
    const addTaskSub = this.taskRepo.add$(task).subscribe(newTask => {
      this.isLoading = false;
      if (!newTask) {
        this.errorMessage = 'An error occurred, please try again.';
        return;
      }

      this.taskRepo.search$().pipe(take(1)).subscribe({
        error: (err) => this.errorMessage = err
      });

      this.resetForm();
    }, (err) => {
      this.isLoading = false;
      this.errorMessage = err;
    });

    this.subscriptions.add(addTaskSub);
  }

  private initForm(): void {
    this.addTaskForm = this.fb.group({
      description: [{
        value: '',
        disabled: this.isLoading,
      }, {
        validators: [Validators.required]
      }],
      completed: [{
        value: false,
        disabled: this.isLoading,
      }]
    });
  }

  private initTask(): void {
    this.subscriptions = this.activatedRoute.data
      .subscribe((data: { task: Task }) => {
        if (!data.task) {
          this.mode = this.ADD_MODE;
        } else {
          this.mode = this.EDIT_MODE;
          this.task = data.task;
        }
      });
  }

  private resetForm(): void {
    this.addTaskForm.reset();
  }

  get description(): AbstractControl {
    return this.addTaskForm.get('description');
  }

  get completed(): AbstractControl {
    return this.addTaskForm.get('completed');
  }

}
