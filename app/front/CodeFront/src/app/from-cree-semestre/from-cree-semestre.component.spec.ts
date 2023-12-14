import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromCreeSemestreComponent } from './from-cree-semestre.component';

describe('FromCreeSemestreComponent', () => {
  let component: FromCreeSemestreComponent;
  let fixture: ComponentFixture<FromCreeSemestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FromCreeSemestreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FromCreeSemestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
