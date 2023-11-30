import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AxiosService {
  private apiUrl = 'http://127.0.0.1:4200/utilisateurs/get';

  getData(): Observable<any> {
    return new Observable(observer => {
      axios.get(this.apiUrl)
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}
