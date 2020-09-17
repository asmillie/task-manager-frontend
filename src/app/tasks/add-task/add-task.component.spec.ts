import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, Subscription, throwError } from 'rxjs';
import { mockAppRepositoryService } from '../../../mocks/mock-app-repository-service';
import { mockRouter } from '../../../mocks/mock-router';
import { mockTaskRepositoryService } from '../../../mocks/mock-task-repository-service';
import { mockTasks } from '../../../mocks/mock-tasks';
import { SharedModule } from '../../shared/shared.module';
import { Task } from '../task';
import { TaskRepositoryService } from '../task-repository.service';

import { AddTaskComponent } from './add-task.component';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule,
      ],
      declarations: [ AddTaskComponent ],
      providers: [
        { provide: TaskRepositoryService, useValue: mockTaskRepositoryService as any },
        { provide: Router, useValue: mockRouter as any },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initForm method', () => {
      const formSpy = jest.spyOn(component as any, 'initForm');

      expect(formSpy).not.toHaveBeenCalled();
      component.ngOnInit();
      expect(formSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe on subscription', () => {
      component.addTaskSub = new Subscription();
      const unsubSpy = jest.spyOn(component.addTaskSub, 'unsubscribe');


      expect(unsubSpy).not.toHaveBeenCalled();
      component.ngOnDestroy();
      expect(unsubSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSubmit', () => {

    it('should return on invalid form', () => {
      expect(component.addTaskForm.status).toEqual('INVALID');
      expect(mockTaskRepositoryService.add$).not.toHaveBeenCalled();
      component.onSubmit();
      expect(mockTaskRepositoryService.add$).not.toHaveBeenCalled();
    });

    describe('Valid Form Submission', () => {

      const desc = 'Description';
      const completed = false;
      const newTask = new Task(desc, completed);

      beforeEach(() => {
        component.addTaskForm.get('description').setValue(desc);
        component.addTaskForm.get('completed').setValue(completed);
        component.errorMessage = '';
      });

      it('should call task repository add method with task', () => {
        mockTaskRepositoryService.add$.mockReturnValue(of(mockTasks[0]));
        mockTaskRepositoryService.search$.mockReturnValue(of(true));

        expect(component.addTaskForm.status).toEqual('VALID');
        component.onSubmit();
        expect(mockTaskRepositoryService.add$).toHaveBeenCalledWith(newTask);
      });

      it('should set error message on no task returned by add method', () => {
        mockTaskRepositoryService.add$.mockReturnValue(of(null));

        component.onSubmit();
        expect(component.errorMessage).not.toEqual('');
      });

      it('should set error message returned by search method', () => {
        mockTaskRepositoryService.add$.mockReturnValue(of(mockTasks[0]));
        mockTaskRepositoryService.search$.mockReturnValue(throwError('error'));

        component.onSubmit();
        expect(component.errorMessage).toEqual('error');
      });

      it('should set error message returned by add method', () => {
        mockTaskRepositoryService.add$.mockReturnValue(throwError('error'));

        component.onSubmit();
        expect(component.errorMessage).toEqual('error');
      });
    });
  });
});
