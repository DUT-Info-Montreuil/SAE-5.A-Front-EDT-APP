import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AxiosService {
  private apiUrlGet = 'http://127.0.0.1:5050/utilisateurs/get';
  private apiUrlPost = 'http://127.0.0.1:5050/utilisateurs/add';

  getData(): Observable<any> {
    return new Observable(observer => {
      axios.get(this.apiUrlGet)
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
  
  postData(formData: any): Observable<any> {
    return new Observable(observer => {
      axios.post(this.apiUrlPost, formData)
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
