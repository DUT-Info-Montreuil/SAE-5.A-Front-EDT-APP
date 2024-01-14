import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injectable,
  NgZone,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {getHours, isSameDay, isSameMonth, setHours, setMinutes} from 'date-fns';
import {flatMap, map, share, Subject, Subscription, timer} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {changePage} from "../../../main";
import {HttpClient} from "@angular/common/http";
import {DatePipe, formatDate} from "@angular/common";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {da} from "date-fns/locale";
import {resolve} from "@angular/compiler-cli";
import {CdkDragDrop} from "@angular/cdk/drag-drop";




function getHoursMinutes(timeList: String[]) {
  timeList.pop();
  return timeList.join(':');
}

function getDisplayDate() {
  try {
    // console.log("date: " + window.localStorage.getItem("calendarDateView"))
    let dayview = window.localStorage.getItem("calendarDateView")
    if(dayview !== null){
      return new Date(dayview)
    }
    else {
      return new Date()
    }

  }
  catch(e){
    return new Date()
  }


}

function getDisplayGroupe() {
  let groupe = window.localStorage.getItem("currentIdGroupe")
  if(groupe){
    return Number(groupe)
  }
  else {
    return 1
  }
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
  encapsulation: ViewEncapsulation.None,
})

export class ScheduleComponent{
  defaultSelectedGroupe: number = getDisplayGroupe();
  selectedGroupe: number = getDisplayGroupe();


  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;
  viewDate = getDisplayDate();
  timeList =  new Date().toLocaleTimeString().split(':')
  nowTime = getHoursMinutes(this.timeList);
  //
  dayStartHour = Math.max(0, getHours(new Date()) - 6);

  dayEndHour = Math.min(23, getHours(new Date()) + 5);

  refreshCalendar = new Subject<void>();
  loadingCalendar: boolean = false;

  activeDayIsOpen: boolean = true;
  groupesList: {idGroupe: any, name: any, subGroupes: any[]}[] = []

  ressource: string = "";
  filtreDatePicker = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  externalEvents: CalendarEvent[] = [
    {
      title: 'Event 1',
      start: new Date(),
      draggable: true,
    },
    {
      title: 'Event 2',
      start: new Date(),
      draggable: true,
    },
  ];
  events: CalendarEvent[] = [
  ];

  droppedElement: any;


  constructor(private route: ActivatedRoute, private http: HttpClient, private elementRef: ElementRef) {
    getDisplayDate();
    getDisplayGroupe();
    this.getGroupes();
    this.getCoursGroupe(this.defaultSelectedGroupe);

    // setInterval(() => {
    //     const currentDate = new Date()
    //     this.nowTime = getHoursMinutes(new Date().toLocaleTimeString().split(':'));
    //     this.refreshCalendar.next()
    // }, 1000);
  }


  setView(view: CalendarView, date: Date) {
    this.viewDate = date;
    this.view = view;
  }

  testEvent(event: any) {
    console.log("EVENNT" + event)
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }




  getResizable() {
    if (this.isInEditionMod()) {
      return {
        afterEnd: true,
        beforeStart: true

      }
    }
    return {}
  }

  isInEditionMod() {

    return this.route.snapshot.component?.name == "_ScheduleEditComponent"
  }
  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refreshCalendar.next()
  }




  changeDay(date: any) {
    // console.log("picked: " + date)
    this.viewDate = date;
  }

  getProfesseur(){
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'};

    this.http.get('http://localhost:5050/cours/get/null', {headers}).subscribe({
      next: async (data: any) => {
        // console.log("data: " + JSON.stringify(data))
        this.events = await this.jsonToEvent(data);
      },
      error: (error: any) => {
        console.log(error);
        return {}
      }
    });
  }

  getCoursGroupe(idGroupe: number) {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'};

    this.http.get('http://localhost:5050/groupe/getGroupeCours/'+idGroupe, {headers}).subscribe({
      next: async (data: any) => {
        // console.log("data: " + JSON.stringify(data))
        this.loadingCalendar = true
        this.events = await this.jsonToEvent(data);
        this.loadingCalendar = false
        this.refreshCalendar.next()
      },
      error: (error: any) => {
        console.log(error);
        this.events = [];
        return {}
      }
    });
  }
  async jsonToEvent(results: any[]) {
    let bdEvent: CalendarEvent[] = []
    for (let result of results) {
      if (result != null) {
        // console.log("result: " + JSON.stringify(result))
      }
      let heureDebutList = result.HeureDebut.split(':')
      let nombreHeureList = result.NombreHeure.split(':')
      let date = new Date(result.Jour);
      let titre = await this.updateRessource(result.idCours)
      bdEvent.push({
        start: setHours(setMinutes(date, heureDebutList[1]), heureDebutList[0]),
        end: setHours(setMinutes(date, Number(nombreHeureList[1]) + Number(heureDebutList[1])), Number(nombreHeureList[0]) + Number(heureDebutList[0])),
        title: titre,
        resizable: this.getResizable(),
        draggable: this.isInEditionMod()
      })
    }
    return bdEvent
  }

  updateRessource(idCours: Number) : Promise<string>{
    return new Promise((resolve, reject) => {
    let titre = "tota"
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'};
    this.http.get('http://localhost:5050/ressource/get/'+idCours, {headers}).subscribe({
      next: (data: any) => {
        // console.log(JSON.stringify(data[0]))
        // console.log("topto: " +  data[0].titre)
        titre = data[0].titre;
        resolve(titre)
      },
      error: (error: any) => {
        reject("toto")
      }
    });
  });
  }

  addProf(event: Event){
    console.log("addprof");
  }

  eventDropped({
                 event,
                 newStart,
                 newEnd,
                 allDay,
               }: CalendarEventTimesChangedEvent): void {
    const externalIndex = this.externalEvents.indexOf(event);
    if (typeof allDay !== 'undefined') {
      event.allDay = allDay;
    }
    if (externalIndex > -1) {
      this.externalEvents.splice(externalIndex, 1);
      this.events.push(event);
    }
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }
    if (this.view === 'month') {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
    this.events = [...this.events];
    // console.log("titi")
  }

  externalDrop(event: CalendarEvent) {
    if (this.externalEvents.indexOf(event) === -1) {
      this.events = this.events.filter((iEvent) => iEvent !== event);
      this.externalEvents.push(event);
    }
  }


  protected readonly Date = Date;
  protected readonly console = console;

  saveDate(date: any) {
    if(date == null){
      date = new Date().toLocaleDateString();
    }
    let dateList = date.split('/')
    // console.log("dateString: " + date)
    // console.log("new date" + dateList[1]+"/"+dateList[0]+"/"+dateList[2])
    window.localStorage.setItem("calendarDateView", dateList[1]+"/"+dateList[0]+"/"+dateList[2])
  }

  getEventTitle(event: any) {
    console.log(event);
  }

  drop(event: CdkDragDrop<{title: string;}[]>) {
    console.log("event2: " + event.item.data.title)
    console.log("html2: " + event.dropPoint)
  }

  private elementDroppedToEvent(elementDropped: any) {
    this.events.push({
        start: new Date('01/12/2024'),
        title: elementDropped.title,
        resizable: this.getResizable(),
        draggable: this.isInEditionMod()
      }
    )
  }
  getGroupes() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'};

    this.http.get('http://localhost:5050/groupe/getAll', {headers}).subscribe({
      next: async (data: any) => {
        // console.log("data: " + JSON.stringify(data))
        this.groupesList = this.orderedGroupeList(data);
      },
      error: (error: any) => {
        // console.log(error);
        return {}
      }
    });
  }

  private orderedGroupeList(data: any[]) {
    let listGroupe: {idGroupe: any, name: any, subGroupes: any[]}[] = []
    for(let groupe of data){
      if(!groupe.idGroupe_parent){
        listGroupe.push({
          idGroupe: groupe.IdGroupe,
          name: groupe.Nom,
          subGroupes: []
        })
      }
      else {
        let parentGroupe = listGroupe.find(g => g.idGroupe === groupe.idGroupe_parent);
        if(parentGroupe){
          parentGroupe.subGroupes.push(groupe);
        }
      }
    }
    return listGroupe;
  }

  protected readonly window = window;
}
