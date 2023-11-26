import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreerUtilisateurComponent } from './form-creer-utilisateur.component';

describe('FormCreerUtilisateurComponent', () => {
  let component: FormCreerUtilisateurComponent;
  let fixture: ComponentFixture<FormCreerUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreerUtilisateurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCreerUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
