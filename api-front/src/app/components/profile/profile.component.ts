import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

    user: any = {};
    role :any = {};
    
    constructor(private http: HttpClient) { 
        this.getLoggedUser();
    }


    getLoggedUser(): any {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        this.http.get('http://localhost:5050/utilisateurs/getLoggedUser', { headers }).subscribe({
          next: (data: any) => {
            this.user = data;
            this.role = data.role;
            console.log(data);
          },
          error: (error: any) => {
            console.log(error);
          }
        });
      }
}
