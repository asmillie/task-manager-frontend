import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';

const mockHttpService: Partial<HttpClient> = {
  post: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(mockHttpService as HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
