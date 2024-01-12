import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ConnexionComponent} from "../connexion/connexion.component";
import {ActivatedRoute} from "@angular/router";
import {ScheduleComponent} from "../schedule/schedule.component";
import {ScheduleEditComponent} from "../schedule/schedule-edit/schedule-edit.component";
import {CalendarEvent} from "angular-calendar";

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
  componentName = "None";
  static componentName: string;
  coursList = [
    "cours1",
    "cours2",
    "cours3",
    "cours3",
    "cours3",
    "cours3",
    "cours3",
    "cours3",
  ];

  externalEvents: CalendarEvent[] = [
    {
      title: "cours1",
      start: new Date(),
      draggable: true,
    },
    {
      title: "cours2",
      start: new Date(),
      draggable: true,
    },
    {
      title: "cours3",
      start: new Date(),
      draggable: true,
    },
    {
      title: "cours4",
      start: new Date(),
      draggable: true,
    },
  ];

  get isSideBarOpen() {
      return this.isOpen ? "open" : "closed";
  }

  toggleSideBar(){
      this.isOpen = !this.isOpen;
  }


  onRouterOutletActivate(event: any) {
    if(event  instanceof ConnexionComponent){
      this.componentName = "ConnexionComponent";
    }
    else if (event instanceof ScheduleEditComponent){
      this.componentName = "ScheduleEditComponent";
    }
    else{
      this.componentName = "None";
    }
    SidebarComponent.componentName = this.componentName;


  }
  protected readonly event = event;
}


