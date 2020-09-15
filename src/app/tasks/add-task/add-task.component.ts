import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Task } from '../task';
import { User } from '../../user/class/user';
import { TaskRepositoryService } from '../task-repository.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit, OnDestroy {

  user: User;
  addTaskForm: FormGroup;
  isLoading: boolean;
  addTaskSub: Subscription;
  errorMessage = '';

  constructor(
    private taskRepo: TaskRepositoryService,
    private router: Router,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.addTaskSub) {
      this.addTaskSub.unsubscribe();
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.addTaskForm.status !== 'VALID') {
      this.isLoading = false;
      return;
    }
    console.log(this.addTaskForm);

    const task = new Task(this.description.value, this.completed.value);
    this.addTaskSub = this.taskRepo.add$(task).subscribe(newTask => {
      this.isLoading = false;
      if (!newTask) {
        this.errorMessage = 'An error occurred, please try again.';
      }

      this.resetForm();
    }, (err) => {
      this.isLoading = false;
      this.errorMessage = err;
    });
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
