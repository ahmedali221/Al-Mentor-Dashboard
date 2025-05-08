import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CLessonsComponent } from './lessons.component';

describe('CLessonsComponent', () => {
  let component: CLessonsComponent;
  let fixture: ComponentFixture<CLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CLessonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
