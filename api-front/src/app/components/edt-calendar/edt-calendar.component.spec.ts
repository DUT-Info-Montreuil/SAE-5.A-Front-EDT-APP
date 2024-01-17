import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdtCalendarComponent } from './edt-calendar.component';

describe('EdtCalendarComponent', () => {
  let component: EdtCalendarComponent;
  let fixture: ComponentFixture<EdtCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EdtCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdtCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
