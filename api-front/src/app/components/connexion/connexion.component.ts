import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { changePage } from '../../../main';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css',
})
export class ConnexionComponent {
  showErrorMessage = false;

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
 


    console.log(this.loginForm.value);
    this.http.post('http://localhost:5050/utilisateurs/auth', {} ,{
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' +
            btoa(
              this.loginForm.value.Username +
                ':' +
                this.loginForm.value.Password
            ),
        },
      })
      .subscribe({
        next: (data: any) => {
          let token = data.accessToken;
          let firstLogin = data.firstLogin;
          
          this.setToken(token);
          if (firstLogin) {
            
            
            changePage('/first-login');
            return;
          }
          changePage('/edt-calendar');
        },
        error: (error) => {
          this.showErrorMessage = true;
        },
      });
  }



  setToken(token: string) {
    window.localStorage.setItem('token', token);
  }
}
