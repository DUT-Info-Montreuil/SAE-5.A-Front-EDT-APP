import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  

  constructor() { }

   static search(id : string , list : any[] , listSearch : any[]){
    const search : any = document.getElementById(id);
    console.log(search);
    search.addEventListener("keyup", (e :any ) => {
      const searchString : string = e.target.value.toLowerCase();
      console.log("yee")
      
      if (searchString != "" ) {
        listSearch  = list.filter((e : any) => {return e.titre.toLowerCase().startsWith(searchString.toLowerCase())});
      }else {
        listSearch =  list;
      }
      console.log(listSearch);

    });


  }
  
}
