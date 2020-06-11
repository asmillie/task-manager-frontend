import { TestBed } from '@angular/core/testing';

import { AppRepositoryService } from './app-repository.service';

describe('AppRepositoryService', () => {
  let service: AppRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
