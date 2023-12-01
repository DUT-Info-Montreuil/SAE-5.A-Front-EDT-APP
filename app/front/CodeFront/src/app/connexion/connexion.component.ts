import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  protected loginForm = new FormGroup({
    login: new FormControl("", [Validators.required, Validators.minLength(1)]),
    password: new FormControl("", [Validators.required, Validators.minLength(1)]),
  });
  constructor(private router: Router) {
    this.loginForm.valid

  }

  clickEvent() {

  }

  get login() {
    return this.loginForm.get("login")
  }

  get password() {
    return this.loginForm.get("password")
  }
}
