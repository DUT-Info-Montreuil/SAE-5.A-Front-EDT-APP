import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { interval, Subscription } from 'rxjs';

let subscription: Subscription;

// Every time (in ms) check if token is here else redirect exept if already on connexion
let time = 1000
const source = interval(time);
subscription = source.subscribe(val => redirectToLogin());

function redirectToLogin() {
  if (!window.localStorage.getItem("token") && document.location.pathname!="/connexion")
    document.location.pathname ="/connexion";
}
function changePage(pathname:string, changeWebSite:boolean) {  
  if (changeWebSite){
    document.location.href = pathname
    return;
  }
  // if no token return to login page
  redirectToLogin()
  document.location.pathname = pathname;
  setTimeout(() => console.log("test nav"), 1000)
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

export {changePage}