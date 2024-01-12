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



function getHoursMinutes(timeList: String[]) {
  timeList.pop();
  return timeList.join(':');
}

function getDisplayDate() {
  try {
    console.log("date: " + window.localStorage.getItem("calendarDateView"))
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

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
  encapsulation: ViewEncapsulation.None,
})

export class ScheduleComponent{

  selected: Date | null = new Date();




  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate = getDisplayDate();
  timeList =  new Date().toLocaleTimeString().split(':')
  nowTime = getHoursMinutes(this.timeList);
  //
  dayStartHour = Math.max(0, getHours(new Date()) - 6);

  dayEndHour = Math.min(23, getHours(new Date()) + 5);

  refreshCalendar = new Subject<void>();

  activeDayIsOpen: boolean = true;
  coursList: any[] = []

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

  constructor(private route: ActivatedRoute, private http: HttpClient, private elementRef: ElementRef) {
    getDisplayDate();
    this.getCours();
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
    console.log("picked: " + date)
    this.viewDate = date;
  }

  getCours() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'};

    this.http.get('http://localhost:5050/cours/get/null', {headers}).subscribe({
      next: async (data: any) => {
        this.events = await this.jsonToEvent(data);
      },
      error: (error: any) => {
        console.log(error);
        return {}
      }
    });
  }
  async jsonToEvent(results: any[]) {
    let bdEvent: CalendarEvent[] = []
    for (let result of results) {
      if (result != null) {
        console.log("result: " + result)
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
        console.log("topto: " +  data[0].titre)
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
    console.log("titi")
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
}
