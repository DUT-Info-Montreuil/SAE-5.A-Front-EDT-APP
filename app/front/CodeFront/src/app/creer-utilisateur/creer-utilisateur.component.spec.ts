import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerUtilisateurComponent } from './creer-utilisateur.component';

describe('CreerUtilisateurComponent', () => {
  let component: CreerUtilisateurComponent;
  let fixture: ComponentFixture<CreerUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerUtilisateurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreerUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
