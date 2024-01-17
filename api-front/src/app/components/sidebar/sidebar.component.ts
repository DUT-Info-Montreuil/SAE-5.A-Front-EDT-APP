import {Component} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ConnexionComponent} from "../connexion/connexion.component";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  animations: [
    trigger("openClose", [
      // ...
      state(
          "open",
          style({
            opacity: 1,
            transform: "scale(1, 1)"
          })
      ),
      state(
          "closed",
          style({
            opacity: 0,
            transform: "scale(0.95, 0.95)",
            width: 0,
            margin: "0px"
          })
      ),
      transition("open => closed", [animate("80ms ease-in")]),
      transition("closed => open", [animate("300ms ease-out")])
    ]),
    trigger("openClose2", [
        // ...
        state(
            "closed",
            style({
                opacity: 1,
                transform: "scale(1, 1)"
            })
        ),
        state(
            "open",
            style({
                opacity: 0,
                transform: "scale(0.95, 0.95)",
                width: 0,
                height: 0,
                margin: 0
            })
        ),
        transition("open => closed", [animate("50ms ease-in")]),
        transition("closed => open", [animate("300ms ease-out")])
    ])
  ]
})
export class SidebarComponent {
  isOpen= true;
  isConnection = false;
  static isConnection: boolean;
  get isSideBarOpen() {
      return this.isOpen ? "open" : "closed";
  }



  toggleSideBar(){
      this.isOpen = !this.isOpen;
  }

  onRouterOutletActivate(event: any) {
    this.isConnection = event instanceof ConnexionComponent;
    SidebarComponent.isConnection = this.isConnection;

  }
}


