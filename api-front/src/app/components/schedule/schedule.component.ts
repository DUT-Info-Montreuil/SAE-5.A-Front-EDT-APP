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
import {map, share, Subject, Subscription, timer} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {changePage} from "../../../main";
import {HttpClient} from "@angular/common/http";
import {DatePipe, formatDate} from "@angular/common";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
  encapsulation: ViewEncapsulation.None,
})

export class ScheduleComponent{

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate = new Date();
  nowDate = new Date().toLocaleTimeString();
  //
  dayStartHour = Math.max(0, getHours(new Date()) - 6);

  dayEndHour = Math.min(23, getHours(new Date()) + 5);

  refreshCalendar = new Subject<void>();

  activeDayIsOpen: boolean = true;

  constructor(private route: ActivatedRoute, private http: HttpClient, private elementRef: ElementRef) {
    this.getCours()
    setInterval(() => {

        const currentDate = new Date()
        this.nowDate = currentDate.toLocaleTimeString();
        this.refreshCalendar.next()
    }, 1000);
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




  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }

  getCours() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'};

    this.http.get('http://localhost:5050/cours/get/null', {headers}).subscribe({
      next: (data: any) => {
        console.log(data);
        this.events = this.jsonToEvent(data);
        console.log("events: " + this.events[0].end + this.events[0].start)
      },
      error: (error: any) => {
        console.log(error);
        return {}
      }
    });
  }
  jsonToEvent(results: any[]) {
    let bdEvent = []
    for (let result of results){
      if(result != null){
        console.log("result: " + result)
      }
      let heureDebutList = result.HeureDebut.split(':')
      let nombreHeureList = result.NombreHeure.split(':')
      let date = new Date(result.Jour);
      bdEvent.push({
        start: setHours(setMinutes(date, heureDebutList[1]), heureDebutList[0]),
        end: setHours(setMinutes(date, Number(nombreHeureList[1])+Number(heureDebutList[1])),  Number(nombreHeureList[0])+Number(heureDebutList[0])),
        title: this.getRessource(result.idCours),
        resizable: this.getResizable(),
        draggable: this.isInEditionMod()
      })
    }
    return bdEvent
  }

  getRessource(idCours: Number){
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'};
     titreRessource : String = ''
    this.http.get('http://localhost:5050/ressource/get/'+idCours, {headers}).subscribe({
      next: (data: any) => {
        titreRessource = data[0].titre
        return titreRessource
      },
      error: (error: any) => {
        return 'toto'
      }
    });
    return titreRessource
  }


  protected readonly Date = Date;
  protected readonly console = console;
}
