import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationUtilisateurService } from './navigation-utilisateur.service';

@Component({
  selector: 'app-menu-utilisateur',
  standalone: true,
  templateUrl: './menu-utilisateur.component.html',
  styleUrl: './menu-utilisateur.component.css',
  template: `
    <ul>
      <li (click)="navigateToForm1()">Formulaire 1</li>
      <li (click)="navigateToForm2()">Formulaire 2</li>
    </ul>
  `,
})
export class MenuUtilisateurComponent {
  constructor(private navigationService: NavigationUtilisateurService) {}

  navigateToForm1() {
    this.navigationService.navigateToForm1();
  }

  navigateToForm2() {
    this.navigationService.navigateToForm2();
  }
}
