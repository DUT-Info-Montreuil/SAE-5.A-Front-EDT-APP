import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { changePage } from '../../../main';


@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrl: './first-login.component.css'
})
export class FirstLoginComponent {
  showErrorMessage = false;
  protected loginForm = new FormGroup({
    Password1: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    Password2: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  });
  constructor(private http: HttpClient) {
    this.loginForm.valid;
  }


  changePassword() {

    if (this.loginForm.value.Password1 != this.loginForm.value.Password2) {
      //errror 
      this.showErrorMessage = true;
      return;
    }
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.put('http://localhost:5050/utilisateurs/password/update', {"Password" : this.loginForm.value.Password1} ,{headers}).subscribe(()=>{
      
    
    
    changePage('/home')});


  }
}
