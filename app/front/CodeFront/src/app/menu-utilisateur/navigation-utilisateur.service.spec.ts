import { TestBed } from '@angular/core/testing';

import { NavigationUtilisateurService } from './navigation-utilisateur.service';

describe('NavigationUtilisateurService', () => {
  let service: NavigationUtilisateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationUtilisateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
