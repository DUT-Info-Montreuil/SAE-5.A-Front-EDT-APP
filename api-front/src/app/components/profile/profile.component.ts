import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
    currentDate = new Date();
    dateOptions: { label: string; value: string }[] = [];
    selectedDate: string = '';


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
    monthlyWorkedHours: any = {};
    
    constructor(private http: HttpClient) { 

    }

    ngOnInit(): void {
        this.generateYearList();
        this.selectedDate = this.getDefaultDate();
        console.log(this.dateOptions);
        this.getLoggedUser().then((data: any) => {
            this.user = data;
            this.getMonthlyWorkedHours();
        });
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
        mois: this.selectedDate
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

  generateYearList(): void {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 3;
    const endYear = currentYear + 1;

    for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
          const formattedMonth = month < 10 ? `0${month}` : `${month}`;
          const value = `${year}-${formattedMonth}`;
          const label = `${this.monthName(month)} ${year}`;
          this.dateOptions.push({ label, value });
        }
      }
  }

  monthName(month: number): string {
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(2000, month - 1, 1));
  }

  getDefaultDate(): string {
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth() + 1; // Les mois vont de 0 à 11

    return `${currentYear}-${currentMonth < 10 ? '0' : ''}${currentMonth}`;
  }

  changeDate(event:any): void {
    this.selectedDate = event.target.value;
    this.getMonthlyWorkedHours();
  }


}
