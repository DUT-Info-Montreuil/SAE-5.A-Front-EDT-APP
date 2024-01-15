import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

    user = {
      FirstName: '',
      LastName: '',
      Username: '',
      idUtilisateur: '',
      role: {
        bureau: '',
        id: '',
        initiale: '',
        type: '',
        groupe: '',
      }
    };
    //role :any = {};
    monthlyWorkedHours: any = {};
    
    constructor(private http: HttpClient) { 
      this.getLoggedUser().then((data: any) => {
        this.user = data;
        console.log(this.user);
        this.getMonthlyWorkedHours();
      }
      );
        
        //this.getMonthlyWorkedHours();
    }


    async getLoggedUser(): Promise<void> {
      return new Promise<void>((resolve, reject) => { 
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        this.http.get('http://localhost:5050/utilisateurs/getLoggedUser', { headers }).subscribe({
          next: (data: any) => {
            resolve(data);
          },
          error: (error: any) => {
            console.log(error);
          }
        });
      });
        
      }

  getMonthlyWorkedHours(): any {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    const id = this.user.role.id;
    const body = { 
      mois: "2024-01"
     };
    this.http.post('http://localhost:5050/utilisateurs/getTeacherHoursInMonth/' + id, body, { headers }).subscribe({
      next: (data: any) => {
        this.monthlyWorkedHours = data;
        console.log("data" + data);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}
