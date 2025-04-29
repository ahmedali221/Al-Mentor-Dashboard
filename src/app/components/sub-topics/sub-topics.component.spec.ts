import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTopicsComponent } from './sub-topics.component';

describe('SubTopicsComponent', () => {
  let component: SubTopicsComponent;
  let fixture: ComponentFixture<SubTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubTopicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
