import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTrouverUtilisateurComponent } from './form-trouver-utilisateur.component';

describe('FormTrouverUtilisateurComponent', () => {
  let component: FormTrouverUtilisateurComponent;
  let fixture: ComponentFixture<FormTrouverUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTrouverUtilisateurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormTrouverUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
