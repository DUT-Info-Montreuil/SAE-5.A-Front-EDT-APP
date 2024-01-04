import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleReadonlyComponent } from './schedule-readonly.component';

describe('ScheduleReadonlyComponent', () => {
  let component: ScheduleReadonlyComponent;
  let fixture: ComponentFixture<ScheduleReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleReadonlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
