import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css',
})
export class ConnexionComponent {
  protected loginForm = new FormGroup({
    Username: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    Password: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  });
  constructor(private http: HttpClient) {
    this.loginForm.valid;
  }

  connexion() {
    this.http
      .post('http://localhost:5050/utilisateurs/auth', this.loginForm.value, {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: (data: any) => {
          let token = data.accessToken;
          let firstLogin = data.fistLogin;
          window.localStorage.setItem('token', token);
          if (firstLogin) {
            // TODO: redirect to page first login
            console.log('redirect to page for first login');
          }
          document.location.pathname = '/create-users';
        },
      });
  }
}