import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ConnexionComponent} from "../connexion/connexion.component";

import { first } from 'rxjs';
import { FirstLoginComponent } from '../first-login/first-login.component';

import {ActivatedRoute} from "@angular/router";
import {CalendarEvent} from "angular-calendar";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import { EdtCalendarComponent } from '../edt-calendar/edt-calendar.component';
import { HttpClient } from '@angular/common/http';
import { da } from 'date-fns/locale';
import { changePage } from '../../../main';

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

  isConnection = false;
  isOpen= true;
  componentName = "None";
  static componentName: string;
  showCreation = false;
  showEdition = false;
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

  externalEvents = [
    {
      title: "cours1"
    },
    {
      title: "cours2"
    },
    {
      title: "cours3"
    },
    {
      title: "cours4"
    },
  ];


  constructor( private http: HttpClient ) {}

  get isSideBarOpen() {
      return this.isOpen ? "open" : "closed";
  }

  toggleSideBar(){
      this.isOpen = !this.isOpen;
  }


  onRouterOutletActivate(event: any) {

    this.isConnection = (event instanceof ConnexionComponent) || (event instanceof FirstLoginComponent);
    
    

    if(event  instanceof ConnexionComponent){
      this.componentName = "ConnexionComponent";
    }
    else if (event instanceof EdtCalendarComponent){
      this.componentName = "EdtCalendarComponent";
    }
    else{
      this.componentName = "None";
    }
    SidebarComponent.componentName = this.componentName;


  }
  protected readonly event = event;


  drop(event: CdkDragDrop<{title: string;}[]>) {
    console.log("event: " + event.item.data.title)
    console.log("html: " + event.dropPoint)
  }


  redirectToAccount(){
    changePage('/profile');
  }
  disconnect(){
    localStorage.removeItem('token');
    changePage('/connexion');
  }



  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.get('http://localhost:5050/utilisateurs/getLoggedUser' ,{headers}).subscribe((data :any)=>{

    data.role.type
    if (data.role.type <=2){
      this.showEdition = true;
      if (data.role.type == 0){
        this.showCreation = true;
      }
        

        }
      }
    )
  }
    




}


