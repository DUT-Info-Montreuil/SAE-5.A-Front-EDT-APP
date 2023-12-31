import { Component } from '@angular/core';
import { changePage } from '../../../main';
import {SidebarComponent} from '../sidebar/sidebar.component';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [SidebarComponent]
})
export class NavbarComponent {
  sidebar = SidebarComponent
  pageLink(pageName:string) {
    changePage("/"+pageName)
  }
  isConnection(){
    console.log("isconnection : " + this.sidebar.isConnection)
    return this.sidebar.isConnection
  }
}
