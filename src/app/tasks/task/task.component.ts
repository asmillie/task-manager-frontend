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
    private router: Router,
    private taskRepo: TaskRepositoryService,
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

    if (this.mode === this.EDIT_MODE) {
      this.task.description = this.description.value;
      this.task.completed = this.completed.value;

      this.taskRepo.edit$(this.task).pipe(take(1)).subscribe(editTask => {
        this.isLoading = false;
        if (!editTask) {
          this.errorMessage = 'An error occurred, please try again.';
          return;
        }

        this.resetForm();
        this.router.navigateByUrl('/tasks');
      }, (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error communicating with the server, please try again.';
      });

    } else {
      const task = new Task(this.description.value, this.completed.value);

      this.taskRepo.add$(task).pipe(take(1)).subscribe(newTask => {
        this.isLoading = false;
        if (!newTask) {
          this.errorMessage = 'An error occurred, please try again.';
          return;
        }

        this.resetForm();
        this.router.navigateByUrl('/tasks');
      }, (err) => {
        this.isLoading = false;
        this.errorMessage = err;
      });
    }
  }

  private initForm(): void {
    this.addTaskForm = this.fb.group({
      description: [{
        value: (this.mode === this.EDIT_MODE) ? this.task.description : '' ,
        disabled: this.isLoading,
      }, {
        validators: [Validators.required]
      }],
      completed: [{
        value: (this.mode === this.EDIT_MODE) ? this.task.completed : false,
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
