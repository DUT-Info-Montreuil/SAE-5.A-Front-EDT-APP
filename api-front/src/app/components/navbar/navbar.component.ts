import {Component, signal} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
/*  animations: [
    trigger('openClose', [
      state('true', style({ width: 'auto' })),
      state('false', style({ width: '0px' })),
      transition('false <=> true', animate(500))
    ])
  ]*/
})
export class NavbarComponent {

  isOpen = true;
  toggleNavBar(){
    if(this.isOpen){
      this.isOpen = false;
    }
    else{
      this.isOpen = true;
    }
  }
}


