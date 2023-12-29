import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
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
  private timeoutId = {currentTimeout:0, oldTimeout:0};
  constructor(private http: HttpClient, ) {
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
          this.setToken(token)
          if (firstLogin) {
            // TODO: redirect to page first login
            console.log('redirect to page for first login');
          }
          document.location.pathname = '/create-users';
        },
      });
  }
  /**
   * Set the token for a certain time default is 30min
   * @param {string} token identification token
   * @param {number} [expire=1800000] time before destroying token in ms
   */
  setToken(token:string, expire:number = 1800000) {
    this.timeoutId.currentTimeout = window.setTimeout(() => {
      clearTimeout(this.timeoutId.oldTimeout);
      this.timeoutId.oldTimeout = this.timeoutId.currentTimeout;
      window.localStorage.removeItem('token')
    }, /*expire*/ 10000)
    window.localStorage.setItem('token', token);
  }
}