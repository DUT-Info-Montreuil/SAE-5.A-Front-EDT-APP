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
  changeDetection: ChangeDetectionStrategy.Default,
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
    {
      start: setHours(setMinutes(new Date(), 20), 15),
      end: setHours(setMinutes(new Date(), 40), 17),
      title: 'An event',
      resizable: this.getResizable(),
      draggable: this.isInEditionMod()
    },
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
    const token = localStorage.getItem('token')
    this.http
      .get('http://localhost:5050/cours/get/1', {
        headers: {'Authorization': `Bearer ${token}`},
      })
      .subscribe({
        next: (data: any) => {
        },
      });
  }


  protected readonly Date = Date;
  protected readonly console = console;
}
