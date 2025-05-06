import { TestBed } from '@angular/core/testing';

import { SubtopicsService } from './subtopics.service';

describe('SubtopicsService', () => {
  let service: SubtopicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubtopicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
