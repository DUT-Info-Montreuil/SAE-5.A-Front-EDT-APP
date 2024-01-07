import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourceManagerComponent } from './ressource-manager.component';

describe('RessourceManagerComponent', () => {
  let component: RessourceManagerComponent;
  let fixture: ComponentFixture<RessourceManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RessourceManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RessourceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
