import { Component } from '@angular/core';
import { changePage } from '../../main';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
  pageLink(pageName:string) {
    changePage("/"+pageName)
  }
}
